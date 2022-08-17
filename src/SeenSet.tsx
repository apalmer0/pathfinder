export default class SeenSet {
  set: { [row: number]: Set<number> };

  constructor() {
    this.set = {};
  }

  has(row: number, col: number): boolean {
    if (row in this.set && this.set[row].has(col)) {
      return true;
    } else {
      return false;
    }
  }

  add(row: number, col: number): void {
    if (row in this.set) {
      this.set[row].add(col);
    } else {
      this.set[row] = new Set();
      this.set[row].add(col);
    }
  }
}
