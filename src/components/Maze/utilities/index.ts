import {
  CellTypes,
  GenerationAlgorithm,
  MazeType,
  Path,
  Position,
  SeenSet,
} from "../../../types";

const randBetween = (low: number, high: number): number => {
  const half = Math.floor(high / 2) - 2;
  const random = Math.floor(Math.random() * (half - low + 1) + low);
  const double = random * 2;

  // always return an odd number to ensure we have a border around maze
  return double + 1;
};

const shuffle = <T>(arr: T[]): T[] => {
  let currentIndex = arr.length;
  let randomIndex = Math.floor(Math.random() * currentIndex);

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    const tmp = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = tmp;
  }

  return arr;
};

const createBaseMaze = (mazeSize: number, fill: CellTypes): MazeType => {
  const maze: MazeType = [];

  for (let i = 0; i < mazeSize; i++) {
    const newRow = [];

    for (let j = 0; j < mazeSize; j++) {
      newRow.push(fill);
    }

    maze.push(newRow);
  }

  return maze;
};

const findNeighbors = (row: number, col: number, maze: MazeType): Path => {
  const neighbors: Path = [];

  if (row > 1 && maze[row - 2][col] === CellTypes.WALL) {
    neighbors.push([row - 2, col]);
  }

  if (row < maze.length - 2 && maze[row + 2][col] === CellTypes.WALL) {
    neighbors.push([row + 2, col]);
  }

  if (col > 1 && maze[row][col - 2] === CellTypes.WALL) {
    neighbors.push([row, col - 2]);
  }

  if (col < maze[0].length - 2 && maze[row][col + 2] === CellTypes.WALL) {
    neighbors.push([row, col + 2]);
  }

  return shuffle<Position>(neighbors);
};

const backtrack = (mazeSize: number): MazeType => {
  const maze = createBaseMaze(mazeSize, CellTypes.WALL);

  const row = randBetween(1, mazeSize - 1);
  const col = randBetween(1, mazeSize - 1);
  let path: Path = [[row, col]];

  maze[row][col] = CellTypes.SPACE;

  while (path.length > 0) {
    const [currRow, currCol] = path[path.length - 1];
    const neighbors = findNeighbors(currRow, currCol, maze);

    if (neighbors.length === 0) {
      path = path.slice(0, path.length - 1);
    } else {
      const [neighborRow, neighborCol] = neighbors[0];

      maze[neighborRow][neighborCol] = CellTypes.SPACE;

      const newRow = Math.floor((neighborRow + currRow) / 2);
      const newCol = Math.floor((neighborCol + currCol) / 2);

      maze[newRow][newCol] = CellTypes.SPACE;

      path.push([neighborRow, neighborCol]);
    }
  }

  return maze;
};

export const generateMaze = (
  mazeSize: number,
  algorithm: GenerationAlgorithm = GenerationAlgorithm.BACKTRACKING
): MazeType => {
  switch (algorithm) {
    case GenerationAlgorithm.BACKTRACKING:
      return backtrack(mazeSize);
    default:
      return backtrack(mazeSize);
  }
};

const seen = (row: number, col: number, fakeSet: SeenSet) => {
  if (row in fakeSet && fakeSet[row].has(col)) {
    return true;
  } else {
    return false;
  }
};

const add = (row: number, col: number, fakeSet: SeenSet) => {
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
  const fakeSet: { [row: number]: Set<number> } = {};
  const q: [number, number, Path][] = [[...start, []]];

  while (q.length > 0) {
    const [row, col, path] = q[0];
    q.shift();

    if (seen(row, col, fakeSet)) continue;
    add(row, col, fakeSet);

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

    if (!seen(row + 1, col, fakeSet)) q.push([row + 1, col, updatedPath]);
    if (!seen(row - 1, col, fakeSet)) q.push([row - 1, col, updatedPath]);
    if (!seen(row, col + 1, fakeSet)) q.push([row, col + 1, updatedPath]);
    if (!seen(row, col - 1, fakeSet)) q.push([row, col - 1, updatedPath]);
  }
};
