import React from "react";

import "./Cell.css";

interface Props {
  handleClick: () => void;
  isEnd: boolean;
  isStart: boolean;
  visited: boolean;
  partOfSolution: boolean;
}

const Cell: React.FC<Props> = ({
  handleClick,
  isEnd,
  isStart,
  partOfSolution,
  visited,
}) => {
  const className = `cell ${visited ? "visited" : ""} ${
    isStart ? "start" : ""
  } ${isEnd ? "end" : ""} ${partOfSolution ? "solution" : ""}`;
  return <div className={className} onClick={handleClick} />;
};

export default Cell;
