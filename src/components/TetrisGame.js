import React from "react";
import GameBoard from "./GameBoard";
import pieceTemplates from "./GamePieces";
import utils from "../utilities";

// import testGrid from "./testGrid";

const pieceTemplateNames = Object.getOwnPropertyNames(pieceTemplates);

class TetrisGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clearedLinesCount: 0,
            currentPiece: [],
            // grid: testGrid,
            grid: [],
            level: 0
        };

        this.baselineMoveInterval = 400;
        this.tickLength = this.baselineMoveInterval;
        this.lastTick = window.performance.now();
    }

    componentDidMount() {
        this.init();
        this.startGameIterationInterval();
    }

    componentWillUnmount() {
        this.stopGameIterationInterval();
    }

    init() {
        const piece = this.selectNextPiece();
        this.setState({currentPiece: piece}, () => this.shadowState = JSON.parse(JSON.stringify(this.state)));
        this.updateTickLength();
        document.addEventListener('keydown', event => this.handleKeyPress(event));
    }

    startGameIterationInterval() {
        this.gameIterationInterval = setInterval(() => this.mainLoop(), 10);
    }

    stopGameIterationInterval() {
        this.gameIterationInterval && clearInterval(this.gameIterationInterval);
        this.gameIterationInterval = null;
    }

    updateTickLength(rushMode = false) {
        this.tickLength = rushMode
            ? 25
            : Math.max(this.baselineMoveInterval - this.calculateLevel() * 5, 25);
    }

    calculateLevel() {
        return Math.floor(this.state.clearedLinesCount / 10);
    }

    mainLoop() {
        const currTick = window.performance.now();
        const nextTick = this.lastTick + this.tickLength;

        if (currTick < nextTick) {
            return;
        }

        const didResetPiece = this.moveCurrentPiece(0, 1);
        if (didResetPiece) {
            //check for lines to clear
            const clearedCount = this.clearCompletedLines();
            if (clearedCount > 0) {
                this.shadowState.clearedLinesCount += clearedCount;
            }

            this.updateTickLength();
        }

        this.commitUpdates();
        this.lastTick = window.performance.now();
    }

    handleKeyPress(event) {
        event.preventDefault();
        if (event.key === 'ArrowUp') {
            // rotate the piece
            this.rotateCurrentPiece();
        } else if (event.key === 'ArrowDown') {
            // send the current piece all the way down
            this.updateTickLength(true)
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

        this.commitUpdates();
    }

    moveCurrentPiece(xDir, yDir) {
        const currentPiece = JSON.parse(JSON.stringify(this.shadowState.currentPiece));
        const nextMove = utils.translatePiece(currentPiece, xDir, yDir);

        // make sure the move is valid
        const boundary = this.doesPieceHitBoundary(nextMove);

        if (boundary === 'left' || boundary === 'right' || (boundary === 'grid' && xDir !== 0 && yDir === 0)) {
            return false;
        }

        if (boundary === 'bottom' || boundary === 'grid') {
            this.shadowState.grid = this.shadowState.grid.concat(this.shadowState.currentPiece);
            this.shadowState.currentPiece = this.selectNextPiece();
            return true;
        }

        // move the piece
        this.shadowState.currentPiece = nextMove;

        return false;
    }

    rotateCurrentPiece() {
        const currentPiece = JSON.parse(JSON.stringify(this.shadowState.currentPiece));
        const rotated = utils.rotate(currentPiece);

        const boundary = this.doesPieceHitBoundary(rotated);
        if (boundary === false) {
            this.shadowState.currentPiece = rotated;
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

        const intersectedCoords = this.shadowState.grid.filter(coord => {
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

    clearCompletedLines() {
        const linesToBeRemoved = this.getListOfLinesToClear();
        this.shadowState.grid = this.shadowState.grid.filter(coords => !linesToBeRemoved.includes(coords.y));

        this.condenseGrid(linesToBeRemoved);

        return linesToBeRemoved.length;
    }

    getListOfLinesToClear() {
        // count the number of blocks in each row
        const rowCounts = this.shadowState.grid.reduce((acc, coords) => {
            acc[coords.y] = (acc[coords.y] || 0) + 1;
            return acc;
        }, {});

        return Object.getOwnPropertyNames(rowCounts)
            .filter(row => rowCounts[row] === this.props.columns)
            .map(row => Number.parseInt(row));
    }

    condenseGrid(removedLines) {
        // sort ascending
        removedLines.sort((a, b) => a - b);

        // sort descending based on row number
        this.shadowState.grid.sort((a, b) => b.y - a.y);
        this.shadowState.grid = this.shadowState.grid.map(coords => {
            for (const lineNumber of removedLines) {
                if (coords.y < lineNumber) {
                    coords.y++;
                }
            }
            return coords;
        });
    }

    commitUpdates() {
        this.setState(() => this.shadowState);
    }

    render() {
        return (
            <GameBoard rows={this.props.rows}
                       cols={this.props.columns}
                       currentPiece={this.state.currentPiece}
                       grid={this.state.grid}
                       lineCount={this.state.clearedLinesCount}
            />
        );
    }
}

export default TetrisGame;