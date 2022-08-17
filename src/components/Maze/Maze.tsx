import React, { useCallback, useEffect, useState } from "react";

import Cell from "../Cell";
import { generateMaze, solveMaze } from "./utilities";
import { GenerationAlgorithm, MazeType, Position } from "../../types";
import "./Maze.css";

const DEFAULT_LOCATION: Position = [-1, -1];
const MIN_SIZE = 21;
const MAX_SIZE = 51;

const Maze = () => {
  const [maze, setMaze] = useState<MazeType>([[]]);
  const [mazeSize, setMazeSize] = useState(MIN_SIZE);
  const [start, setStart] = useState<Position>(DEFAULT_LOCATION);
  const [end, setEnd] = useState<Position>(DEFAULT_LOCATION);
  const [generationAlgorithm, setGenerationAlgorithm] = useState(
    GenerationAlgorithm.BACKTRACKING
  );

  const updateMaze = useCallback(() => {
    const newMaze = generateMaze(mazeSize, generationAlgorithm);

    setMaze(newMaze);
  }, [generationAlgorithm, mazeSize]);

  const resetState = useCallback(() => {
    updateMaze();
    setStart(DEFAULT_LOCATION);
    setEnd(DEFAULT_LOCATION);
  }, [updateMaze]);

  useEffect(() => {
    resetState();
  }, [mazeSize, resetState]);

  const handleMazeSizeChange = (size: string) => {
    let newSize = Number(size);
    newSize = newSize % 2 === 0 ? newSize + 1 : newSize;

    setMazeSize(newSize);
  };

  const handleClick = (row: number, col: number) => {
    if (maze[row][col] !== 0) return;

    if (start === DEFAULT_LOCATION) {
      setStart([row, col]);
    } else {
      setEnd([row, col]);
    }
  };

  const selectGenerationAlgorithm = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setGenerationAlgorithm((value as unknown) as GenerationAlgorithm);
  };

  const isInvalid = (arr: Position): boolean => {
    return arr.some((ele) => ele === -1);
  };

  const invalid = isInvalid(start) || isInvalid(end);

  const solve = () => {
    if (invalid) return;

    solveMaze(start, end, maze, setMaze);
  };

  const mazeDimensions = window.innerHeight * 0.75;
  const cellSize = mazeDimensions / mazeSize;

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
      <div className="controls">
        <div className="buttons">
          <button
            disabled={invalid}
            onClick={solve}
            className={`maze-button ${invalid ? "disabled" : ""}`}
          >
            solve
          </button>
          <button className="maze-button" onClick={resetState}>
            reset
          </button>
        </div>
        <div>
          <div className="title">Maze generation Algorithm</div>
          <select
            name="generation-algorithm"
            onChange={selectGenerationAlgorithm}
            value={generationAlgorithm}
          >
            <option value={GenerationAlgorithm.BACKTRACKING}>
              Backtracking
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
      </div>
    </div>
  );
};

export default Maze;
