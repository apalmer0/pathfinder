import React, { useEffect, useState } from "react";

import Cell from "../Cell";
import "./Maze.css";

const DEFAULT_LOCATION: [number, number] = [-1, -1];
const MIN_SIZE = 20;
const MAX_SIZE = 50;

const Maze = () => {
  const [maze, setMaze] = useState<number[][]>([[]]);
  const [mazeSize, setMazeSize] = useState(MIN_SIZE);
  const [start, setStart] = useState<[number, number]>(DEFAULT_LOCATION);
  const [end, setEnd] = useState<[number, number]>(DEFAULT_LOCATION);

  const generateMaze = () => {
    const newMaze: number[][] = [];
    for (let i = 0; i < mazeSize; i++) {
      const newRow = [];

      for (let j = 0; j < mazeSize; j++) {
        newRow.push(Math.round(Math.random()));
      }

      newMaze.push(newRow);
    }

    setMaze(newMaze);
  };

  useEffect(() => {
    resetState();
  }, [mazeSize]);

  const handleMazeSizeChange = (size: string) => {
    setMazeSize(Number(size));
  };

  const resetState = () => {
    generateMaze();
    setStart(DEFAULT_LOCATION);
    setEnd(DEFAULT_LOCATION);
  };

  const fakeSet: any = {};

  const seen = (row: number, col: number) => {
    if (row in fakeSet && fakeSet[row].has(col)) {
      return true;
    } else {
      return false;
    }
  };

  const add = (row: number, col: number) => {
    if (row in fakeSet) {
      fakeSet[row].add(col);
    } else {
      fakeSet[row] = new Set();
      fakeSet[row].add(col);
    }
  };

  const handleClick = (row: number, col: number) => {
    if (maze[row][col] !== 0) return;

    if (start === DEFAULT_LOCATION) {
      setStart([row, col]);
    } else {
      setEnd([row, col]);
    }
  };

  const isInvalid = (arr: [number, number]): boolean => {
    return arr.some((ele) => ele === -1);
  };

  const invalid = isInvalid(start) || isInvalid(end);

  const solveMaze = async () => {
    if (invalid) return;

    const q: [number, number, [number, number][]][] = [[...start, []]];

    while (q.length > 0) {
      const [row, col, path] = q[0];
      q.shift();

      if (seen(row, col)) continue;
      add(row, col);

      if (row < 0 || row === maze.length) continue;
      if (col < 0 || col === maze[0].length) continue;
      if (maze[row][col] === 1) continue;

      const newMaze = [...maze];
      newMaze[row][col] = 2;
      setMaze(newMaze);

      await new Promise((r) => setTimeout(r, 25));

      const updatedPath: [number, number][] = [...path, [row, col]];

      if (row === end[0] && col === end[1]) {
        const newMaze = [...maze];
        path.forEach((cell) => {
          newMaze[cell[0]][cell[1]] = 3;
        });
        setMaze(newMaze);
        break;
      }

      if (!seen(row + 1, col)) q.push([row + 1, col, updatedPath]);
      if (!seen(row - 1, col)) q.push([row - 1, col, updatedPath]);
      if (!seen(row, col + 1)) q.push([row, col + 1, updatedPath]);
      if (!seen(row, col - 1)) q.push([row, col - 1, updatedPath]);
    }
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
            onClick={solveMaze}
            className={`maze-button ${invalid ? "disabled" : ""}`}
          >
            solve
          </button>
          <button className="maze-button" onClick={resetState}>
            reset
          </button>
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
