import styled from "styled-components";

export default styled.div`
    box-sizing: border-box;
    background-color: ${props => props.color || "transparent"};
    border: 2px black solid;
    height: 100%;
    width: 4vh;
`;

