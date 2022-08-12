import React from "react";

import "./Cell.css";

interface Props {
  handleClick: () => void;
  isEnd: boolean;
  isStart: boolean;
}

const Cell: React.FC<Props> = ({ handleClick, isEnd, isStart }) => {
  const className = `cell ${isStart ? "start" : ""} ${isEnd ? "end" : ""}`;
  return <div className={className} onClick={handleClick} />;
};

export default Cell;
