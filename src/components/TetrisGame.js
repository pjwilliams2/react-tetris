// @flow
import * as React from "react";
import GameBoard from "./GameBoard";
import pieceTemplates from "./GamePieces";
import utils from "../utilities";

// import testGrid from "./testGrid";

const pieceTemplateNames: Array<Object> = Object.getOwnPropertyNames(pieceTemplates);

type Props = {
    rows: number,
    columns: number
};

type State = {
    clearedLinesCount: number,
    currentPiece: Array<Object>,
    grid: Array<Object>,
    level: number,
    score: number
};

class TetrisGame extends React.Component<Props, State> {
    state = {
        clearedLinesCount: 0,
        currentPiece: [],
        // grid: testGrid,
        grid: [],
        level: 1,
        score: 0
    };

    shadowState: Object;
    lastTick: number;
    tickLength: number
    mainLoopIntervalId: ?IntervalID;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
        this.init();
        this.startGameIterationInterval()
    }

    componentWillUnmount(): void {
        this.stopGameIterationInterval();
    }

    init(): void {
        this.lastTick = window.performance.now();
        this.setState({currentPiece: this.selectNextPiece()}, () => {
            this.shadowState = JSON.parse(JSON.stringify(this.state));
            this.updateTickLength();
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => this.handleKeyPress(event));
        document.addEventListener('keyup', (event: KeyboardEvent) => this.handleKeyUp(event));
    }

    startGameIterationInterval(): void {
        this.mainLoopIntervalId = setInterval(() => this.mainLoop(), 1);
    }

    stopGameIterationInterval(): void {
        this.mainLoopIntervalId && clearInterval(this.mainLoopIntervalId);
        this.mainLoopIntervalId = null;
    }

    updateTickLength(hardDrop: string = 'none'): void {
        this.tickLength = Math.pow(0.8 - ((this.shadowState.level - 1) * 0.007), this.shadowState.level - 1) * 1000.0;
        if (hardDrop === 'hard') {
            this.tickLength = 0.01;
        } else if (hardDrop === 'soft') {
            this.tickLength /= 20;
        }

    }

    calculateLevel() {
        return Math.ceil(this.state.clearedLinesCount / 10);
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
                this.shadowState.score += this.calculatePoints(clearedCount);
                this.shadowState.level = this.calculateLevel();
            }

            this.updateTickLength();
        }

        this.commitUpdates();
        this.lastTick = window.performance.now();
    }

    handleKeyPress(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === 'ArrowUp') {
            // rotate the piece
            console.log('UpArrow');
            this.rotateCurrentPiece();
        } else if (event.key === 'ArrowDown') {
            // send the current piece all the way down
            this.updateTickLength('soft')
        } else if (event.key === 'ArrowLeft') {
            this.moveCurrentPiece(-1, 0);
        } else if (event.key === 'ArrowRight') {
            this.moveCurrentPiece(1, 0);
        } else if (event.keyCode === 32) {
            // spacebar
            this.updateTickLength('hard');
        } else {
            console.log(event);
        }

        this.commitUpdates();
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'ArrowDown') {
            this.updateTickLength();
        }
    }

    moveCurrentPiece(xDir: number, yDir: number): boolean {
        const currentPiece = JSON.parse(JSON.stringify(this.shadowState.currentPiece));
        const nextMove = utils.translatePiece(currentPiece, xDir, yDir);

        // make sure the move is valid
        const boundary = this.doesPieceHitBoundary(nextMove);

        if (boundary === 'left' || boundary === 'right' || (boundary === 'grid' && xDir !== 0 && yDir === 0)) {
            return false;
        }

        const anyNegYCoords = nextMove.some(coords => coords.y < 0);
        if (boundary === 'grid' && yDir !== 0 && anyNegYCoords) {
            console.log('Game over');
            this.stopGameIterationInterval();
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

    rotateCurrentPiece(): void {
        const currentPiece = JSON.parse(JSON.stringify(this.shadowState.currentPiece));
        const rotated = utils.rotate(currentPiece);

        const boundary = this.doesPieceHitBoundary(rotated);
        if (boundary === false) {
            this.shadowState.currentPiece = rotated;
        }
    }

    doesPieceHitBoundary(piece: Array<Object>): string | false {
        const minCoords = utils.getMinCoords(piece);
        const maxCoords = utils.getMaxCoords(piece);

        if (maxCoords.y >= this.props.rows) {
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

    selectNextPiece(): Array<Object> {
        // center the piece on the board
        const template = this.getRandomPieceTemplate();
        return utils.translatePiece(JSON.parse(JSON.stringify(template)), Math.floor(this.props.columns / 2), 0);
    }

    getRandomPieceTemplate(): Array<Object> {
        return pieceTemplates[pieceTemplateNames[Math.floor(Math.random() * pieceTemplateNames.length)]];
    }

    clearCompletedLines(): number {
        const linesToBeRemoved = this.getListOfLinesToClear();
        this.shadowState.grid = this.shadowState.grid.filter(coords => !linesToBeRemoved.includes(coords.y));

        this.condenseGrid(linesToBeRemoved);

        return linesToBeRemoved.length;
    }

    getListOfLinesToClear(): Array<number> {
        // count the number of blocks in each row
        const rowCounts = this.shadowState.grid.reduce((acc, coords) => {
            acc[coords.y] = (acc[coords.y] || 0) + 1;
            return acc;
        }, {});

        return Object.getOwnPropertyNames(rowCounts)
            .filter(row => rowCounts[row] === this.props.columns)
            .map(row => Number.parseInt(row));
    }

    condenseGrid(removedLines: Array<number>): void {
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

    calculatePoints(linesClearedCount: number): number {
        return Math.max(0, 50 * linesClearedCount)
            + Math.max(0, 100 * (linesClearedCount - 1))
            + Math.max(0, 200 * (linesClearedCount - 2))
            + Math.max(0, 400 * (linesClearedCount - 3));
    }

    commitUpdates(): void {
        this.setState(() => this.shadowState);
    }

    render() {
        return (
            <GameBoard rows={this.props.rows}
                       cols={this.props.columns}
                       currentPiece={this.state.currentPiece}
                       grid={this.state.grid}
                       lineCount={this.state.clearedLinesCount}
                       score={this.state.score}
            />
        );
    }
}

export default TetrisGame;