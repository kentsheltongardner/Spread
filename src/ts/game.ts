import Level from './level.js'
import Point from './point.js'
import Rectangle from './rectangle.js'

const levelData = [
    {
        grid: [
            '1 1',
        ],
        goal: new Point(1, 0)
    },
    {
        grid: [
            '1',
            '1',
            '0',
            '0',
        ],
        goal: new Point(0, 3)
    },
    {
        grid: [
            '0 1 1',
            '0 0 1',
        ],
        goal: new Point(0, 1)
    },
    {
        grid: [
            '0 3 0',
            '0 0 0',
            '0 2 0',
        ],
        goal: new Point(0, 1)
    },
    {
        grid:     [
            '0 3 0',
            '0 0 0',
            '1 0 1',
        ],
        goal: new Point(1, 1)
    },
    {
        grid: [
            '0 3 0',
            '0 W 0',
            '0 2 0',
        ],
        goal: new Point(0, 1)
    },
    {
        grid: [
            'W 4 3',
            '0 0 0',
            'W 3 W',
        ],
        goal: new Point(0, 1)
    },
    {
        grid: [
            'W 1 2',
            '0 0 W',
            '0 2 W',
        ],
        goal: new Point(0, 1)
    },
    {
        grid: [
            '0 0 0 2 3 1',
        ],
        goal: new Point(1, 0)
    },
    {
        grid: [
            '0 5 0',
            '0 0 4',
            '5 0 0',
        ],
        goal: new Point(0, 1)
    },
    {
        grid: [
            '0 7 0',
            '0 0 6',
            '7 0 0',
        ],
        goal: new Point(0, 1)
    },
    {
        grid: [
            'W 4 W 0',
            '0 0 0 1',
            '0 W 4 0',
        ],
        goal: new Point(3, 1)
    },
    {
        grid:     [
            '0 1 1 1 0',
            '0 0 1 1 0',
            '0 0 1 0 1',
        ],
        goal: new Point(0, 2)
    },
    {
        grid: [
            '0 3 0',
            '0 0 0',
            '0 2 0',
        ],
        goal: new Point(0, 1)
    },
]

export default class Game {

    public level: Level = new Level(Level.stringGridToNumericGrid(levelData[0].grid), levelData[0].goal)
    public levelNumber: number = 0
    public inputs: Point[] = []
    public mousePressed: boolean = false
    public canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement
    public context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D


    constructor() {

        const grid =[
            [1, Level.Wall, 1, 2],
            [3, 1, 1, Level.Wall],
            [1, 1, 0, 0],
            [1, 1, 3, Level.Wall]
        ]
        const grid2 =[
            [0, Level.Wall, 0, 3],
            [3, 0, 0, Level.Wall],
            [0, 0, 2, 0],
            [Level.Wall, 3, 0, Level.Wall]
        ]
        const grid3 =[
            [0, Level.Wall, 3, 0, Level.Wall],
            [3, 0, 0, Level.Wall, 5],
            [0, 0, 2, 0, 3],
            [Level.Wall, 3, 0, Level.Wall, 1]
        ]

        window.addEventListener('mousedown', e => { this.mouseDown(e) })
        window.addEventListener('mousemove', e => { this.mouseMove(e) })
        window.addEventListener('mouseup', e => { this.mouseUp(e) })
        window.addEventListener('keydown', e => { this.keyDown(e) })
        window.addEventListener('resize', () => {
            this.resize()
            this.render()
        })

        this.loadLevelData()
        this.resize()
        this.render()
    }

    resize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }
    mouseDown(e: MouseEvent) {
        if (e.button !== 0) {
            return
        }
        this.mousePressed = true
        this.attemptCreateInput(new Point(e.offsetX, e.offsetY))
        this.render()
    }
    mouseMove(e: MouseEvent) {
        if (!this.mousePressed) {
            return
        }
        this.attemptCreateInput(new Point(e.offsetX, e.offsetY))
        this.render()
    }
    mouseUp(e: MouseEvent) {
        if (e.button !== 0) {
            return
        }
        this.mousePressed = false
        this.level.applyInput(this.inputs)
        this.inputs.length = 0
        this.render()
        if (this.level.isCompleted()) {
            setTimeout(() => {
                this.levelNumber++
                this.loadLevelData()
                this.render()
            }, 1000)
        }
    }
    keyDown(e: KeyboardEvent) {
        if (e.key === 'r') {
            this.loadLevelData()
            this.render()
        } else if (e.key === 'p') {
            this.levelNumber = Math.max(0, this.levelNumber - 1)
            this.loadLevelData()
            this.render()
        } else if (e.key === 'n') {
            this.levelNumber = Math.min(levelData.length - 1, this.levelNumber + 1)
            this.loadLevelData()
            this.render()
        }
    }


    loadLevelData() {
        const data = levelData[this.levelNumber]
        this.level = new Level(Level.stringGridToNumericGrid(data.grid), data.goal)
        this.inputs.length = 0
    }

    attemptCreateInput(displayPoint: Point) {
        const cellSize = this.cellDisplaySize(this.level.width, this.level.height)
        const displayRectangle = this.displayRectangle(this.level.width, this.level.height, cellSize)
        const gridPoint = this.gridPoint(displayPoint, cellSize, displayRectangle)

        if (!this.level.isInBounds(gridPoint)) {
            return
        }
        const type = this.level.typeAt(gridPoint)
        if (!this.level.isValidType(type)) {
            return
        }
        if (this.inputs.length === 0) {
            if (type === Level.Empty) {
                return
            }
            this.inputs.push(gridPoint)
            return
        }
        const otherIndex = this.inputs.findIndex(p => p.x === gridPoint.x && p.y === gridPoint.y)
        if (otherIndex !== -1) {
            this.inputs.length = otherIndex + 1
            return
        }
        const topPoint = this.inputs[this.inputs.length - 1]
        if (Math.abs(topPoint.x - gridPoint.x) + Math.abs(topPoint.y - gridPoint.y) !== 1) {
            return
        }
        const topType = this.level.typeAt(topPoint)
        if (topType === Level.Empty && type !== Level.Empty) {
            return
        }
        if (this.inputs.length === 1 && type === Level.Empty) {
            this.inputs.push(gridPoint)
        }
        if (this.inputs.length > 0 && topType !== type) {
            return
        }
        this.inputs.push(gridPoint)
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        const cellSize = this.cellDisplaySize(this.level.width, this.level.height)
        const displayRectangle = this.displayRectangle(this.level.width, this.level.height, cellSize)

        this.context.fillStyle = '#ace'
        this.context.font = `${cellSize * 0.4}px Arial`
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.lineWidth = cellSize / 30
        const cellPadding = cellSize / 40
        const cellCorner = cellSize / 20
        const paddedCellSize = cellSize - cellPadding * 2
        this.context.beginPath()
        for (let x = 0; x < this.level.width; x++) {
            for (let y = 0; y < this.level.height; y++) {
                const cell = this.level.grid[x][y]
                if (cell === Level.Wall) {
                    continue
                }
                const cellX = displayRectangle.x + x * cellSize + cellPadding
                const cellY = displayRectangle.y + y * cellSize + cellPadding
                this.context.roundRect(cellX, cellY, paddedCellSize, paddedCellSize, cellCorner)
            }
        }
        this.context.fill()

        const style = this.level.isCompleted() ? 'white' : '#8ac'
        this.context.strokeStyle = style
        this.context.fillStyle = style
        const goalPoint = this.displayPoint(this.level.goal, cellSize, displayRectangle)
        this.context.beginPath()
        this.context.arc(goalPoint.x, goalPoint.y, cellSize / 3, 0, Math.PI * 2)
        this.context.stroke()

        for (let x = 0; x < this.level.width; x++) {
            for (let y = 0; y < this.level.height; y++) {
                const rectX = displayRectangle.x + x * cellSize
                const rectY = displayRectangle.y + y * cellSize
                const cell = this.level.grid[x][y]
                if (cell === Level.Empty || cell === Level.Wall) {
                    continue
                }
                this.context.fillText(`${this.level.grid[x][y]}`, rectX + cellSize / 2, rectY + cellSize / 2 + cellSize / 30)
            }
        }

        if (this.inputs.length === 0) {
            return
        }

        this.context.strokeStyle = 'white'
        this.context.lineCap = 'round'
        this.context.lineJoin = 'round'
        this.context.lineWidth = cellSize / 20

        this.context.beginPath()
        const firstPoint = this.displayPoint(this.inputs[0], cellSize, displayRectangle)
        this.context.moveTo(firstPoint.x, firstPoint.y)
        for (let i = 1; i < this.inputs.length; i++) {
            const nextPoint = this.displayPoint(this.inputs[i], cellSize, displayRectangle)
            this.context.lineTo(nextPoint.x, nextPoint.y)
        }
        this.context.stroke()

        const ballRadius = cellSize / 20
        this.context.fillStyle = 'white'
        this.context.beginPath()
        for (const inputPoint of this.inputs) {
            const point = this.displayPoint(inputPoint, cellSize, displayRectangle)
            this.context.moveTo(point.x, point.y)
            this.context.arc(point.x, point.y, ballRadius, 0, Math.PI * 2)
        }
        this.context.stroke()
    }




    

    isGridDisplayVerticallyConstrained(gridWidth: number, gridHeight: number) {
        return window.innerWidth * gridHeight > window.innerHeight * gridWidth
    }
    cellDisplaySize(gridWidth: number, gridHeight: number) {
        return this.isGridDisplayVerticallyConstrained(gridWidth, gridHeight) 
            ? window.innerHeight / gridHeight
            : window.innerWidth / gridWidth
    }
    displayRectangle(gridWidth: number, gridHeight: number, cellSize: number) {
        const w = cellSize * gridWidth
        const h = cellSize * gridHeight
        const x = (window.innerWidth - w) / 2
        const y = (window.innerHeight - h) / 2
        return new Rectangle(x, y, w, h)
    }

    gridX(displayX: number, cellSize: number, displayRectangle: Rectangle) {
        return Math.floor((displayX - displayRectangle.x) / cellSize)
    }
    gridY(displayY: number, cellSize: number, displayRectangle: Rectangle) {
        return Math.floor((displayY - displayRectangle.y) / cellSize)
    }
    gridPoint(displayPoint: Point, cellSize: number, displayRectangle: Rectangle) {
        const x = this.gridX(displayPoint.x, cellSize, displayRectangle)
        const y = this.gridY(displayPoint.y, cellSize, displayRectangle)
        return new Point(x, y)
    }

    displayX(gridX: number, cellSize: number, displayRectangle: Rectangle) {
        return displayRectangle.x + gridX * cellSize + cellSize / 2
    }
    displayY(gridY: number, cellSize: number, displayRectangle: Rectangle) {
        return displayRectangle.y + gridY * cellSize + cellSize / 2
    }
    displayPoint(gridPoint: Point, cellSize: number, displayRectangle: Rectangle) {
        const x = this.displayX(gridPoint.x, cellSize, displayRectangle)
        const y = this.displayY(gridPoint.y, cellSize, displayRectangle)
        return new Point(x, y)
    }
}