const pieceTemplates = {
    square: [
        { x: -1, y: -1, color: 'yellow'},
        { x: 0, y: -1, color: 'yellow'},
        { x: -1, y: 0, color: 'yellow'},
        { x: 0, y: 0, color: 'yellow'},
    ],
    line: [
        { x: 0, y: 0, color: 'lightblue'},
        { x: 0, y: -1, color: 'lightblue'},
        { x: 0, y: -2, color: 'lightblue'},
        { x: 0, y: -3, color: 'lightblue'},
    ],
    elShapeLeft: [
        { x: 0, y: -2, color: 'darkblue'},
        { x: 0, y: -1, color: 'darkblue'},
        { x: 0, y: 0, color: 'darkblue'},
        { x: -1, y: 0, color: 'darkblue'},
    ],
    elShapeRight: [
        { x: 0, y: -2, color: 'orange'},
        { x: 0, y: -1, color: 'orange'},
        { x: 0, y: 0, color: 'orange'},
        { x: 1, y: 0, color: 'orange'},
    ],
    teeShape: [
        { x: 0, y: 0, color: 'purple' },
        { x: -1, y: 1, color: 'purple' },
        { x: 0, y: 1, color: 'purple' },
        { x: 1, y: 1, color: 'purple' }
    ],
    zigZagLeft: [
        { x: -1, y: -1, color: 'red'},
        { x: 0, y: -1, color: 'red'},
        { x: 0, y: 0, color: 'red'},
        { x: 1, y: 0, color: 'red'},
    ],
    zigZagRight: [
        { x: 1, y: -1, color: 'green'},
        { x: 0, y: -1, color: 'green'},
        { x: 0, y: 0, color: 'green'},
        { x: -1, y: 0, color: 'green'},
    ]
};

export default pieceTemplates;