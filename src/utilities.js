const utils = {
    range: n => [...Array(n).keys()],

    getMinCoords(piece) {
        const min = (min, curr) => {
            min.x = curr.x < min.x ? curr.x : min.x;
            min.y = curr.y < min.y ? curr.y : min.y;
            return min;
        };
        return piece.reduce(min, {x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER});
    },

    getMaxCoords(piece) {
        const max = (max, curr) => {
            max.x = curr.x > max.x ? curr.x : max.x;
            max.y = curr.y > max.y ? curr.y : max.y;
            return max;
        };
        return piece.reduce(max, {x: 0, y: 0});
    },

    rotate(piece, degrees = 90) {
        const minCoords = this.getMinCoords(piece);
        const maxCoords = this.getMaxCoords(piece);
        const xTranslation = Math.round((minCoords.x + maxCoords.x) / 2);
        const yTranslation = Math.round((minCoords.y + maxCoords.y) / 2);

        piece = piece.map(coords => {
            return {
                color: coords.color,
                x: coords.x - xTranslation,
                y: coords.y - yTranslation
            };
        });

        return piece.map(coords => {
            if (coords.x === 0 && coords.y === 0) {
                return {
                    color: coords.color,
                    x: xTranslation,
                    y: yTranslation
                };
            }

            const hyp = Math.sqrt(coords.x * coords.x + coords.y * coords.y);

            return {
                color: coords.color,
                x: xTranslation + (coords.y < 0 ? -1 : 1) * Math.round(
                    hyp * Math.cos(Math.acos(coords.x / hyp) + (degrees * Math.PI) / 180)),
                y: yTranslation + (coords.x < 0 ? -1 : 1) * Math.round(
                    hyp * Math.sin(Math.asin(coords.y / hyp) + (degrees * Math.PI) / 180))
            };
        });
    },

    translatePiece(piece, xDir, yDir) {
        return piece.map(coords => {
            coords.x += xDir;
            coords.y += yDir;
            return coords;
        });
    }
};

export default utils;