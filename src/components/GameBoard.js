import React from "react";
import styled from "styled-components";
import TetrisRow from "./TetrisRow";
import utils from "../utilities";

const Game = styled.div`
    // border: 1px black solid;
    height: 100%;
    width: 100%;
    margin: 50px 0 0 0;
`

class GameBoard extends React.Component
{
    renderRows() {
        const blockIndices = utils.range(this.props.rows);
        return blockIndices.map(index => {
            const filledColumns = this.props.grid
                .concat(this.props.currentPiece)
                .filter(coords => {
                    return index === coords.y;
                })

            return <TetrisRow key={index} width={this.props.cols} filledColumns={filledColumns} />
        });
    }

    render() {
        const overlayClass = this.props.showOverlay ? 'game-overlay' : 'hidden';
        return (
            <Game className="game-board">
                <div className={overlayClass}>
                    <div className="game-overlay-text">{this.props.overlayText}</div>
                </div>
                <div className="game-board-layout">
                    <div className="game-stats">
                        <p>Score: {this.props.score}</p>
                        <p>Lines: {this.props.lineCount}</p>
                    </div>
                    <div>
                        {this.renderRows()}
                    </div>
                </div>
            </Game>
        );
    }
}

export default GameBoard;