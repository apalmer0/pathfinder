export type Position = [number, number]

export type MazeType = number[][]

export type Path = Position[]

export enum CellTypes {
  SPACE = 0,
  WALL = 1,
  VISITED = 2,
  SOLUTION = 3,
}

export enum GenerationAlgorithm {
  BACKTRACKING,
  ALDOUS_BRODER,
}

export enum SolutionAlgorithm {
  BFS,
  BIDIRECTIONAL_BFS,
}
