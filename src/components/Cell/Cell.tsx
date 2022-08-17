import React from "react";
import classNames from "classnames";

import { CellTypes } from "../../types";
import "./Cell.css";

interface Props {
  cellType: CellTypes;
  handleClick: () => void;
  isEnd: boolean;
  isStart: boolean;
}

const Cell: React.FC<Props> = ({ handleClick, cellType, isEnd, isStart }) => {
  const className = classNames("cell", {
    end: isEnd,
    solution: cellType === CellTypes.SOLUTION,
    start: isStart,
    visited: cellType === CellTypes.VISITED,
    wall: cellType === CellTypes.WALL,
  });

  return <div className={className} onClick={handleClick} />;
};

export default Cell;
