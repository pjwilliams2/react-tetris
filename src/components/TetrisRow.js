import React from "react";
import styled from "styled-components";
import TetrisBlock from "./TetrisBlock";
import utils from "../utilities";

const Row = styled.div`
    display: flex;
    background-color: white;
    height: 4vh;
    width: 100%;
`;

function renderBlocks(count, filledColumns) {
    return utils.range(count).map(index => {
        const coords = filledColumns.find(coords => coords.x === index);

        return <TetrisBlock key={index} color={coords ? coords.color : null}/>
    })
}

export default function(props) {
    return (
        <Row>
            {renderBlocks(props.width, props.filledColumns)}
        </Row>
    );
}