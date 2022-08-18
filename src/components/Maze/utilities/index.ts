import {
  CellTypes,
  GenerationAlgorithm,
  MazeType,
  Path,
  Position,
  SolutionAlgorithm,
} from "../../../types";
import SeenSet from "../../../SeenSet";

const ANIMATION_DELAY = 25;

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

const findNeighbors = (
  row: number,
  col: number,
  maze: MazeType,
  cellTypes: CellTypes[] = [CellTypes.WALL]
): Path => {
  const neighbors: Path = [];

  if (row > 1 && cellTypes.includes(maze[row - 2][col])) {
    neighbors.push([row - 2, col]);
  }

  if (row < maze.length - 2 && cellTypes.includes(maze[row + 2][col])) {
    neighbors.push([row + 2, col]);
  }

  if (col > 1 && cellTypes.includes(maze[row][col - 2])) {
    neighbors.push([row, col - 2]);
  }

  if (col < maze[0].length - 2 && cellTypes.includes(maze[row][col + 2])) {
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

const aldousBroder = (mazeSize: number): MazeType => {
  const maze = createBaseMaze(mazeSize, CellTypes.WALL);

  let currRow = randBetween(1, mazeSize - 1);
  let currCol = randBetween(1, mazeSize - 1);

  maze[currRow][currCol] = CellTypes.SPACE;

  let numVisited = 1;

  while (numVisited < mazeSize * mazeSize) {
    const neighbors = findNeighbors(currRow, currCol, maze);

    if (neighbors.length === 0) {
      const allNeighbors = findNeighbors(currRow, currCol, maze, [
        CellTypes.SPACE,
        CellTypes.WALL,
      ]);
      const randomIndex = Math.floor(Math.random() * allNeighbors.length);
      const randomNeighbor = allNeighbors[randomIndex];

      currRow = randomNeighbor[0];
      currCol = randomNeighbor[1];

      continue;
    }

    for (const neighbor of neighbors) {
      const [neighborRow, neighborCol] = neighbor;

      if (maze[neighborRow][neighborCol] > 0) {
        // open up wall to new neighbor
        const newRow = Math.floor((neighborRow + currRow) / 2);
        const newCol = Math.floor((neighborCol + currCol) / 2);

        maze[newRow][newCol] = CellTypes.SPACE;

        // mark neighbor as visited
        maze[neighborRow][neighborCol] = 0;

        // bump the number visited
        numVisited += 1;

        // current becomes new neighbor
        currRow = neighborRow;
        currCol = neighborCol;

        break;
      }
    }
  }
  return maze;
};

const bfs = async (
  start: Position,
  end: Position,
  maze: MazeType,
  setMaze: (maze: MazeType) => void,
  seenSet: SeenSet = new SeenSet(),
  seenSet2: SeenSet = new SeenSet()
) => {
  const q: [number, number, Path][] = [[...start, []]];

  while (q.length > 0) {
    const [row, col, path] = q[0];
    q.shift();

    if (seenSet.has(row, col)) continue;
    seenSet.add(row, col);

    if (row < 0 || row === maze.length) continue;
    if (col < 0 || col === maze[0].length) continue;
    if (maze[row][col] === 1) continue;

    const newMaze = [...maze];
    newMaze[row][col] = CellTypes.VISITED;
    setMaze(newMaze);

    await new Promise((r) => setTimeout(r, ANIMATION_DELAY));

    const updatedPath: Path = [...path, [row, col]];

    if (seenSet2.has(row, col) || (row === end[0] && col === end[1])) {
      for (let i = 0; i < updatedPath.length; i++) {
        const [row, col] = updatedPath[i];
        const newMaze = [...maze];
        newMaze[row][col] = CellTypes.SOLUTION;
        setMaze(newMaze);
        await new Promise((r) => setTimeout(r, ANIMATION_DELAY));
      }

      break;
    }

    if (!seenSet.has(row + 1, col)) q.push([row + 1, col, updatedPath]);
    if (!seenSet.has(row - 1, col)) q.push([row - 1, col, updatedPath]);
    if (!seenSet.has(row, col + 1)) q.push([row, col + 1, updatedPath]);
    if (!seenSet.has(row, col - 1)) q.push([row, col - 1, updatedPath]);
  }

  return [];
};

const biDirectionalBfs = async (
  start: Position,
  end: Position,
  maze: MazeType,
  setMaze: (maze: MazeType) => void
) => {
  const seenForward = new SeenSet();
  const seenReverse = new SeenSet();

  bfs(start, end, maze, setMaze, seenForward, seenReverse);
  bfs(end, start, maze, setMaze, seenReverse, seenForward);
};

export const resetMaze = (maze: MazeType): MazeType => {
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[0].length; j++) {
      const touched = [CellTypes.VISITED, CellTypes.SOLUTION];
      if (touched.includes(maze[i][j])) {
        maze[i][j] = CellTypes.SPACE;
      }
    }
  }

  return maze;
};

export const generateMaze = (
  mazeSize: number,
  algorithm: GenerationAlgorithm = GenerationAlgorithm.BACKTRACKING
): MazeType => {
  switch (+algorithm) {
    case GenerationAlgorithm.BACKTRACKING:
      return backtrack(mazeSize);
    case GenerationAlgorithm.ALDOUS_BRODER:
      return aldousBroder(mazeSize);
    default:
      return backtrack(mazeSize);
  }
};

export const solveMaze = async (
  start: Position,
  end: Position,
  maze: MazeType,
  setMaze: (maze: MazeType) => void,
  solutionAlgorithm: SolutionAlgorithm
) => {
  switch (+solutionAlgorithm) {
    case SolutionAlgorithm.BFS:
      return bfs(start, end, maze, setMaze);
    case SolutionAlgorithm.BIDIRECTIONAL_BFS:
      return biDirectionalBfs(start, end, maze, setMaze);
    default:
      return bfs(start, end, maze, setMaze);
  }
};
