import React from "react";
import GameBoard from "./GameBoard";
import pieceTemplates from "./GamePieces";
import utils from "../utilities";

const pieceTemplateNames = Object.getOwnPropertyNames(pieceTemplates);

class TetrisGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clearedLinesCount: 0,
            currentPiece: [],
            grid: [],
            level: 0
        };

        this.baselineMoveInterval = 400;
        this.rushMode = false;
    }

    componentDidMount() {
        this.init();
        this.startGameIterationInterval(this.calculateInterval());
    }

    componentWillUnmount() {
        this.stopGameIterationInterval();
    }

    init() {
        const piece = this.selectNextPiece();
        this.setState({currentPiece: piece});
        document.addEventListener('keydown', event => this.handleKeyPress(event));
    }

    startGameIterationInterval(interval) {
        this.gameIterationInterval = setInterval(() => this.oneMoveIteration(), interval);
    }

    stopGameIterationInterval() {
        this.gameIterationInterval && clearInterval(this.gameIterationInterval);
    }

    calculateInterval() {
        if (this.rushMode) return 25;
        return Math.max(this.baselineMoveInterval - this.calculateLevel() * 5, 25);
    }

    calculateLevel() {
        return Math.floor(this.state.clearedLinesCount / 10);
    }

    oneMoveIteration() {
        const didResetPiece = this.moveCurrentPiece(0, 1);
        if (didResetPiece) {
            //check for lines to clear

            this.resetGameIterationInterval();
        }
    }

    resetGameIterationInterval(rushMode = false) {
        this.rushMode = rushMode;
        this.stopGameIterationInterval();
        this.startGameIterationInterval(this.calculateInterval());
    }

    handleKeyPress(event) {
        event.preventDefault();
        if (event.key === 'ArrowUp') {
            // rotate the piece
            this.rotateCurrentPiece();
        } else if (event.key === 'ArrowDown') {
            // send the current piece all the way down
            this.resetGameIterationInterval(true);
            // temp
            // this.moveCurrentPiece(0, 1);
        } else if (event.key === 'ArrowLeft') {
            this.moveCurrentPiece(-1, 0);
        } else if (event.key === 'ArrowRight') {
            this.moveCurrentPiece(1, 0);
        } else if (event.keyCode === 32) {
            // spacebar
            this.stopGameIterationInterval();
        } else {
            console.log(event);
        }
    }

    moveCurrentPiece(xDir, yDir) {
        const currentPiece = JSON.parse(JSON.stringify(this.state.currentPiece));
        const nextMove = utils.translatePiece(currentPiece, xDir, yDir);

        // make sure the move is valid
        const boundary = this.doesPieceHitBoundary(nextMove);

        if (boundary === 'left' || boundary === 'right' || (boundary === 'grid' && xDir !== 0 && yDir === 0)) {
            return false;
        }

        if (boundary === 'bottom' || boundary === 'grid') {
            this.setState((state, props) => {
                return {
                    currentPiece: this.selectNextPiece(),
                    grid: state.grid.concat(state.currentPiece)
                };
            });
            return true;
        }

        // move the piece
        this.setState(() => ({
            currentPiece: nextMove
        }));

        return false;
    }

    rotateCurrentPiece() {
        const currentPiece = JSON.parse(JSON.stringify(this.state.currentPiece));
        const rotated = utils.rotate(currentPiece);

        const boundary = this.doesPieceHitBoundary(rotated);
        if (boundary === false) {
            this.setState({
                currentPiece: rotated
            });
        }
    }

    doesPieceHitBoundary(piece) {
        const minCoords = utils.getMinCoords(piece);
        const maxCoords = utils.getMaxCoords(piece);

        if (minCoords.y < 0) {
            return 'top';
        } else if (maxCoords.y >= this.props.rows) {
            return 'bottom';
        } else if (minCoords.x < 0) {
            return 'left';
        } else if (maxCoords.x >= this.props.columns) {
            return 'right';
        }

        const intersectedCoords = this.state.grid.filter(coord => {
            const collisions = piece.filter(pieceCoord => {
                return pieceCoord.x === coord.x && pieceCoord.y === coord.y;
            });
            return collisions.length > 0;
        });

        if (intersectedCoords.length > 0) {
            return 'grid';
        }

        return false;
    }

    selectNextPiece() {
        // center the piece on the board
        const template = this.getRandomPieceTemplate();
        return utils.translatePiece(JSON.parse(JSON.stringify(template)), Math.floor(this.props.columns / 2), 0);
    }

    getRandomPieceTemplate() {
        return pieceTemplates[pieceTemplateNames[Math.floor(Math.random() * pieceTemplateNames.length)]];
    }

    render() {
        return (
            <GameBoard rows={this.props.rows}
                       cols={this.props.columns}
                       currentPiece={this.state.currentPiece}
                       grid={this.state.grid}/>
        );
    }
}

export default TetrisGame;