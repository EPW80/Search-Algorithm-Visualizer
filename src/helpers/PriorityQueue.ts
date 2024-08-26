export default class PriorityQueue {
  private elements: { value: any; priority: number }[];

  constructor() {
    this.elements = [];
  }

  push(value: any, priority: number) {
    this.elements.push({ value, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  pop() {
    return this.elements.shift();
  }

  size() {
    return this.elements.length;
  }

  hasElement(
    checkFn: (element: { value: any; priority: number }) => boolean
  ): boolean {
    return this.elements.some(checkFn);
  }
}
