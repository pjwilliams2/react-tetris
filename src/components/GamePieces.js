const pieceTemplates = {
    square: [
        { x: -1, y: -1, color: 'blue'},
        { x: 0, y: -1, color: 'blue'},
        { x: -1, y: 0, color: 'blue'},
        { x: 0, y: 0, color: 'blue'},
    ],
    line: [
        { x: 0, y: 0, color: 'green'},
        { x: 0, y: -1, color: 'green'},
        { x: 0, y: -2, color: 'green'},
        { x: 0, y: -3, color: 'green'},
    ],
    elShape: [
        { x: 0, y: -1, color: 'orange'},
        { x: 0, y: 0, color: 'orange'},
        { x: 0, y: 1, color: 'orange'},
        { x: 1, y: 1, color: 'orange'},
    ],
    zigZagLeft: [
        { x: -1, y: -1, color: 'violet'},
        { x: 0, y: -1, color: 'violet'},
        { x: 0, y: 0, color: 'violet'},
        { x: 1, y: 0, color: 'violet'},
    ],
    zigZagRight: [
        { x: 1, y: -1, color: 'violet'},
        { x: 0, y: -1, color: 'violet'},
        { x: 0, y: 0, color: 'violet'},
        { x: -1, y: 0, color: 'violet'},
    ]
};

export default pieceTemplates;