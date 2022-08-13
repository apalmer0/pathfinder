import React from "react";

import "./Cell.css";

interface Props {
  handleClick: () => void;
  isEnd: boolean;
  isStart: boolean;
  partOfSolution: boolean;
  visited: boolean;
  wall: boolean;
}

const Cell: React.FC<Props> = ({
  handleClick,
  isEnd,
  isStart,
  partOfSolution,
  visited,
  wall,
}) => {
  const className = `cell ${visited ? "visited" : ""} ${
    isStart ? "start" : ""
  } ${wall ? "wall" : ""} ${isEnd ? "end" : ""} ${
    partOfSolution ? "solution" : ""
  }`;
  return <div className={className} onClick={handleClick} />;
};

export default Cell;
