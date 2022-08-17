import { MazeType, Path, Position } from "../../../types";

export const generateMaze = (mazeSize: number): MazeType => {
  const newMaze: number[][] = [];
  for (let i = 0; i < mazeSize; i++) {
    const newRow = [];

    for (let j = 0; j < mazeSize; j++) {
      newRow.push(Math.round(Math.random()));
    }

    newMaze.push(newRow);
  }

  return newMaze;
};

const fakeSet: { [row: number]: Set<number> } = {};

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

export const solveMaze = async (
  start: Position,
  end: Position,
  maze: MazeType,
  setMaze: (maze: MazeType) => void
) => {
  const q: [number, number, Path][] = [[...start, []]];

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

    const updatedPath: Path = [...path, [row, col]];

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
