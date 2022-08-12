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
function App() {
  const [start, setStart] = useState<[number, number]>(DEFAULT_LOCATION);
  const [end, setEnd] = useState<[number, number]>(DEFAULT_LOCATION);

  const clearState = () => {
    setStart(DEFAULT_LOCATION);
    setEnd(DEFAULT_LOCATION);
  };

  const handleClick = (row: number, col: number) => {
    if (start === DEFAULT_LOCATION) {
      setStart([row, col]);
    } else {
      setEnd([row, col]);
    }
  };

  return (
    <div className="App">
      <div className="maze-container">
        {MAZE.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((_, colIndex) => (
              <Cell
                isStart={
                  start ? rowIndex === start[0] && colIndex === start[1] : false
                }
                isEnd={end ? rowIndex === end[0] && colIndex === end[1] : false}
                key={colIndex}
                handleClick={() => handleClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
        <button>solve</button>
        <button onClick={clearState}>clear</button>
      </div>
    </div>
  );
}

export default App;
