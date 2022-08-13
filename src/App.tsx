import React, { useState } from "react";
import "./App.css";

import Cell from "./components/Cell";

const MAZE: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const DEFAULT_LOCATION: [number, number] = [-1, -1];

const copyMaze = () => MAZE.map((row) => row.map((col) => col));

function App() {
  const [maze, setMaze] = useState(copyMaze());
  const [start, setStart] = useState<[number, number]>(DEFAULT_LOCATION);
  const [end, setEnd] = useState<[number, number]>(DEFAULT_LOCATION);

  const clearState = () => {
    setMaze(copyMaze());
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
    if (start === DEFAULT_LOCATION) {
      setStart([row, col]);
    } else {
      setEnd([row, col]);
    }
  };

  const solveMaze = async () => {
    if (start === DEFAULT_LOCATION || end === DEFAULT_LOCATION) {
      return;
    }
    const q: [number, number, [number, number][]][] = [[...start, []]];

    while (q.length > 0) {
      const [rowIndex, colIndex, path] = q[0];
      q.shift();

      if (seen(rowIndex, colIndex)) continue;
      add(rowIndex, colIndex);

      if (rowIndex < 0 || rowIndex === MAZE.length) continue;
      if (colIndex < 0 || colIndex === MAZE[0].length) continue;

      const newMaze = [...maze];
      newMaze[rowIndex][colIndex] = 1;
      setMaze(newMaze);

      await new Promise((r) => setTimeout(r, 25));

      const updatedPath: [number, number][] = [...path, [rowIndex, colIndex]];

      if (rowIndex === end[0] && colIndex === end[1]) {
        const newMaze = [...maze];
        path.forEach((cell) => {
          newMaze[cell[0]][cell[1]] = 2;
        });
        setMaze(newMaze);
        break;
      }

      if (!seen(rowIndex + 1, colIndex))
        q.push([rowIndex + 1, colIndex, updatedPath]);
      if (!seen(rowIndex - 1, colIndex))
        q.push([rowIndex - 1, colIndex, updatedPath]);
      if (!seen(rowIndex, colIndex + 1))
        q.push([rowIndex, colIndex + 1, updatedPath]);
      if (!seen(rowIndex, colIndex - 1))
        q.push([rowIndex, colIndex - 1, updatedPath]);
    }
  };

  return (
    <div className="App">
      <div className="maze-container">
        {maze.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((_, colIndex) => (
              <Cell
                isStart={
                  start ? rowIndex === start[0] && colIndex === start[1] : false
                }
                isEnd={end ? rowIndex === end[0] && colIndex === end[1] : false}
                visited={maze[rowIndex][colIndex] === 1}
                partOfSolution={maze[rowIndex][colIndex] === 2}
                key={colIndex}
                handleClick={() => handleClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
        <button onClick={solveMaze}>solve</button>
        <button onClick={clearState}>clear</button>
      </div>
    </div>
  );
}

export default App;
