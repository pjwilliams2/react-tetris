import React from "react";
import styled from "styled-components";
import TetrisRow from "./TetrisRow";

const Game = styled.div`
    // border: 1px black solid;
    height: 100%;
    width: 100%;
    margin: 50px 0 0 0;
`

class GameBoard extends React.Component
{
    renderRows() {
        const blockIndices = [...Array(this.props.rows).keys()];
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
        return (
            <Game className="game-board">
                <div className="game-stats">
                    <p>Score: {this.props.score}</p>
                    <p>Lines: {this.props.lineCount}</p>
                </div>
                <div>
                    {this.renderRows()}
                </div>
            </Game>
        )
    }
}

export default GameBoard;