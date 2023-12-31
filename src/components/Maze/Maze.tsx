import React, { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

import { Cell } from '../Cell'
import { generateMaze, resetMaze, solveMaze } from './utilities'
import {
  GenerationAlgorithm,
  MazeType,
  Position,
  SolutionAlgorithm,
} from '../../types'
import './Maze.css'

const ANIMATION_DELAY = 25
const DEFAULT_LOCATION: Position = [-1, -1]
const MIN_SIZE = 21
const MAX_SIZE = 51

export const Maze = () => {
  const [maze, setMaze] = useState<MazeType>([[]])
  const [mazeSize, setMazeSize] = useState(MIN_SIZE)
  const [start, setStart] = useState<Position>(DEFAULT_LOCATION)
  const [end, setEnd] = useState<Position>(DEFAULT_LOCATION)
  const [speed, setSpeed] = useState(ANIMATION_DELAY)
  const [solving, setSolving] = useState(false)
  const [solved, setSolved] = useState(false)
  const [solveTime, setSolveTime] = useState(0)
  const [generationAlgorithm, setGenerationAlgorithm] = useState(
    GenerationAlgorithm.BACKTRACKING
  )
  const [solutionAlgorithm, setSolutionAlgorithm] = useState(
    SolutionAlgorithm.BFS
  )

  const createMaze = useCallback(() => {
    const newMaze = generateMaze(mazeSize, generationAlgorithm)

    setMaze(newMaze)
  }, [generationAlgorithm, mazeSize])

  const restoreDefaults = () => {
    setSolved(false)
    setSolving(false)
    setSolveTime(0)
    setStart(DEFAULT_LOCATION)
    setEnd(DEFAULT_LOCATION)
  }

  const resetState = useCallback(() => {
    resetMaze(maze)
    restoreDefaults()
  }, [maze])

  const newMaze = useCallback(() => {
    createMaze()
    restoreDefaults()
  }, [createMaze])

  useEffect(() => {
    newMaze()
  }, [mazeSize, newMaze])

  const handleMazeSizeChange = (size: string) => {
    let newSize = Number(size)
    newSize = newSize % 2 === 0 ? newSize + 1 : newSize

    setMazeSize(newSize)
  }

  const handleSolveSpeedChange = (speed: string) => {
    const newSpeed = Number(speed)
    setSpeed(newSpeed)
  }

  const handleClick = (row: number, col: number) => {
    if (maze[row][col] !== 0) return

    if (start === DEFAULT_LOCATION) {
      setStart([row, col])
    } else {
      setEnd([row, col])
    }
  }

  const selectGenerationAlgorithm = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target
    setGenerationAlgorithm(value as unknown as GenerationAlgorithm)
  }

  const selectSolutionAlgorithm = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target
    setSolutionAlgorithm(value as unknown as SolutionAlgorithm)
  }

  const isInvalid = (arr: Position): boolean => {
    return arr.some((ele) => ele === -1)
  }

  const invalid = isInvalid(start) || isInvalid(end) || solved || solving

  const solve = () => {
    if (invalid) return
    setSolving(true)
    const timestart = new Date().getTime()

    const solveSpeed = ANIMATION_DELAY - speed

    solveMaze(start, end, maze, setMaze, solutionAlgorithm, solveSpeed).then(
      () => {
        setSolving(false)
        setSolved(true)
        // this is technically wrong - it's including the time taken to trace the solution
        const timeend = new Date().getTime()
        setSolveTime(timeend - timestart)
      }
    )
  }

  const getInstructions = () => {
    if (start === DEFAULT_LOCATION) {
      return 'Select a starting point in the maze'
    } else if (end === DEFAULT_LOCATION) {
      return 'Select an end point'
    } else if (solving) {
      return 'Finding the shortest path...'
    } else if (solved) {
      return `Solved in ${solveTime}ms!`
    } else {
      return 'Click solve to find the shortest path'
    }
  }

  const mazeDimensions = window.innerHeight * 0.75
  const cellSize = mazeDimensions / mazeSize

  return (
    <div className="container">
      <div
        className="maze"
        style={{ height: mazeDimensions, width: mazeDimensions }}
      >
        {maze.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((_, colIndex) => (
              <Cell
                cellType={maze[rowIndex][colIndex]}
                handleClick={() => handleClick(rowIndex, colIndex)}
                isEnd={rowIndex === end[0] && colIndex === end[1]}
                isStart={rowIndex === start[0] && colIndex === start[1]}
                key={colIndex}
                size={cellSize}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        className={classNames('instructions', {
          'instructions--solving': solving,
          'instructions--solved': solved,
        })}
      >
        {getInstructions()}
      </div>
      <div className="controls">
        <div className="buttons">
          <button
            disabled={invalid}
            onClick={solve}
            className={classNames('maze-button', {
              disabled: invalid,
            })}
          >
            solve
          </button>
          <button className="maze-button" onClick={resetState}>
            reset
          </button>
          <button className="maze-button" onClick={newMaze}>
            new maze
          </button>
        </div>
        {/* Aldous Broder isn't working at the moment, so let's not even give the option */}
        {/* <div>
          <div className="title">Maze generation Algorithm</div>
          <select
            name="generation-algorithm"
            onChange={selectGenerationAlgorithm}
            value={generationAlgorithm}
          >
            <option value={GenerationAlgorithm.BACKTRACKING}>
              Backtracking
            </option>
            <option value={GenerationAlgorithm.ALDOUS_BRODER}>
              Aldous Broder
            </option>
          </select>
        </div> */}
        <div>
          <div className="title">Solution Algorithm</div>
          <select
            name="solution-algorithm"
            onChange={selectSolutionAlgorithm}
            value={solutionAlgorithm}
          >
            <option value={SolutionAlgorithm.BFS}>BFS</option>
            <option value={SolutionAlgorithm.BIDIRECTIONAL_BFS}>
              Bi-Directional BFS
            </option>
          </select>
        </div>
        <div>
          <div className="title">Maze Size</div>
          <input
            max={MAX_SIZE}
            min={MIN_SIZE}
            onChange={(e) => handleMazeSizeChange(e.target.value)}
            type="range"
            value={mazeSize}
          />
        </div>
        <div>
          <div className="title">Animation Speed</div>
          <input
            max={ANIMATION_DELAY}
            min={0}
            onChange={(e) => handleSolveSpeedChange(e.target.value)}
            type="range"
            value={speed}
          />
        </div>
      </div>
    </div>
  )
}
