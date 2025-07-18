export default class Level {
    static stringGridToNumericGrid(stringGrid) {
        const width = stringGrid[0].split(' ').length;
        const height = stringGrid.length;
        const grid = Array.from({ length: width }, () => Array(height).fill(0));
        for (let j = 0; j < height; j++) {
            const tokens = stringGrid[j].split(' ');
            for (let i = 0; i < width; i++) {
                const token = tokens[i];
                if (token === 'W') {
                    grid[i][j] = Level.Wall;
                }
                else {
                    grid[i][j] = parseInt(token);
                }
            }
        }
        return grid;
    }
    static Empty = 0;
    static Wall = Number.MAX_SAFE_INTEGER;
    width;
    height;
    grid;
    goal;
    goalValue;
    constructor(grid, goal) {
        this.width = grid.length;
        this.height = grid[0].length;
        this.grid = grid;
        this.goal = goal;
        this.goalValue = 0;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cellValue = grid[x][y];
                if (cellValue !== Level.Empty && cellValue !== Level.Wall) {
                    this.goalValue += cellValue;
                }
            }
        }
    }
    isCompleted() {
        return this.grid[this.goal.x][this.goal.y] === this.goalValue;
    }
    typeAt(point) {
        return this.grid[point.x][point.y];
    }
    isInBounds(point) {
        return point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height;
    }
    isValidType(type) {
        return type !== Level.Wall;
    }
    applyInput(input) {
        if (input.length < 2) {
            return;
        }
        const topPoint = input[input.length - 1];
        const topType = this.typeAt(topPoint);
        const bottomType = this.typeAt(input[0]);
        if (topType === Level.Empty) {
            if (bottomType % input.length !== 0) {
                return;
            }
            const spreadAmount = bottomType / input.length;
            for (const inputPoint of input) {
                this.grid[inputPoint.x][inputPoint.y] = spreadAmount;
            }
            return;
        }
        for (const inputPoint of input) {
            this.grid[inputPoint.x][inputPoint.y] = Level.Empty;
        }
        this.grid[topPoint.x][topPoint.y] = topType * input.length;
    }
}
