interface PriorityQueueElement<T> {
  value: T;
  priority: number;
}

export default class PriorityQueue<T> {
  private elements: PriorityQueueElement<T>[];

  constructor() {
    this.elements = [];
  }

  push(value: T, priority: number) {
    const newNode = { value, priority };
    this.elements.push(newNode);
    this.bubbleUp();
  }

  pop(): PriorityQueueElement<T> | undefined {
    const root = this.elements[0];
    const end = this.elements.pop();
    if (this.elements.length > 0 && end) {
      this.elements[0] = end;
      this.bubbleDown();
    }
    return root;
  }

  size(): number {
    return this.elements.length;
  }

  hasElement(checkFn: (element: PriorityQueueElement<T>) => boolean): boolean {
    return this.elements.some(checkFn);
  }

  private bubbleUp() {
    let idx = this.elements.length - 1;
    const element = this.elements[idx];

    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.elements[parentIdx];

      if (element.priority >= parent.priority) break;

      this.elements[parentIdx] = element;
      this.elements[idx] = parent;
      idx = parentIdx;
    }
  }

  private bubbleDown() {
    let idx = 0;
    const length = this.elements.length;
    const element = this.elements[0];

    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let swap = null;

      if (leftChildIdx < length) {
        let leftChild = this.elements[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        let rightChild = this.elements[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < this.elements[swap].priority)
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.elements[idx] = this.elements[swap];
      this.elements[swap] = element;
      idx = swap;
    }
  }
}
