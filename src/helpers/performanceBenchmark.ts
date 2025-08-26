// Simple performance benchmark for grid operations
// Run this in the browser console to test performance improvements

interface BenchmarkResult {
  operation: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  opsPerSecond: number;
}

class GridPerformanceBenchmark {
  private results: BenchmarkResult[] = [];

  // Simulate grid updates for performance testing
  async benchmarkGridUpdates(iterations: number = 1000): Promise<BenchmarkResult> {
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      // Simulate state updates that would trigger re-renders
      const mockGrid = this.createMockGrid(50, 50);
      this.simulateStateChange(mockGrid);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    const result: BenchmarkResult = {
      operation: 'Grid State Updates',
      iterations,
      totalTime,
      averageTime: totalTime / iterations,
      opsPerSecond: iterations / (totalTime / 1000)
    };
    
    this.results.push(result);
    return result;
  }

  // Benchmark cell comparison operations
  benchmarkCellComparisons(iterations: number = 10000): BenchmarkResult {
    const startTime = performance.now();
    
    const cell1 = { isStart: false, isEnd: false, isWall: false, isPath: false, isVisited: false };
    const cell2 = { isStart: false, isEnd: false, isWall: false, isPath: false, isVisited: false };
    
    for (let i = 0; i < iterations; i++) {
      // Simulate the memo comparison function
      const isEqual = (
        cell1.isStart === cell2.isStart &&
        cell1.isEnd === cell2.isEnd &&
        cell1.isWall === cell2.isWall &&
        cell1.isPath === cell2.isPath &&
        cell1.isVisited === cell2.isVisited
      );
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    const result: BenchmarkResult = {
      operation: 'Cell Comparisons',
      iterations,
      totalTime,
      averageTime: totalTime / iterations,
      opsPerSecond: iterations / (totalTime / 1000)
    };
    
    this.results.push(result);
    return result;
  }

  // Benchmark key generation
  benchmarkKeyGeneration(iterations: number = 10000): BenchmarkResult {
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const row = Math.floor(i / 100);
      const col = i % 100;
      
      // Test our optimized key generation
      const key = `${row}-${col}`;
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    const result: BenchmarkResult = {
      operation: 'Key Generation',
      iterations,
      totalTime,
      averageTime: totalTime / iterations,
      opsPerSecond: iterations / (totalTime / 1000)
    };
    
    this.results.push(result);
    return result;
  }

  // Run all benchmarks
  async runAllBenchmarks(): Promise<void> {
    console.log('🚀 Starting Grid Performance Benchmarks...\n');
    
    // Warm up
    await this.benchmarkGridUpdates(100);
    this.results.pop(); // Remove warm-up result
    
    // Run actual benchmarks
    const gridResult = await this.benchmarkGridUpdates(1000);
    const comparisonResult = this.benchmarkCellComparisons(100000);
    const keyResult = this.benchmarkKeyGeneration(100000);
    
    // Display results
    console.table(this.results);
    
    console.log('\n📊 Performance Summary:');
    console.log(`Grid Updates: ${gridResult.opsPerSecond.toFixed(0)} ops/sec`);
    console.log(`Cell Comparisons: ${comparisonResult.opsPerSecond.toFixed(0)} ops/sec`);
    console.log(`Key Generation: ${keyResult.opsPerSecond.toFixed(0)} ops/sec`);
    
    // Performance grades
    this.gradeBenchmarks();
  }

  private createMockGrid(rows: number, cols: number): any[][] {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          row: i,
          col: j,
          isStart: i === 0 && j === 0,
          isEnd: i === rows - 1 && j === cols - 1,
          isWall: Math.random() < 0.1,
          isPath: false,
          isVisited: false
        });
      }
      grid.push(row);
    }
    return grid;
  }

  private simulateStateChange(grid: any[][]): void {
    // Simulate pathfinding algorithm updating cells
    const randomRow = Math.floor(Math.random() * grid.length);
    const randomCol = Math.floor(Math.random() * grid[0].length);
    grid[randomRow][randomCol].isVisited = true;
  }

  private gradeBenchmarks(): void {
    console.log('\n🎯 Performance Grades:');
    
    this.results.forEach(result => {
      let grade = 'F';
      let color = '🔴';
      
      if (result.operation === 'Grid State Updates' && result.opsPerSecond > 500) {
        grade = 'A'; color = '🟢';
      } else if (result.operation === 'Cell Comparisons' && result.opsPerSecond > 1000000) {
        grade = 'A'; color = '🟢';
      } else if (result.operation === 'Key Generation' && result.opsPerSecond > 1000000) {
        grade = 'A'; color = '🟢';
      } else if (result.opsPerSecond > 100000) {
        grade = 'B'; color = '🟡';
      } else if (result.opsPerSecond > 10000) {
        grade = 'C'; color = '🟠';
      }
      
      console.log(`${color} ${result.operation}: Grade ${grade}`);
    });
  }

  // Clear results
  clearResults(): void {
    this.results = [];
    console.log('🧹 Benchmark results cleared');
  }

  // Get results
  getResults(): BenchmarkResult[] {
    return [...this.results];
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).GridPerformanceBenchmark = GridPerformanceBenchmark;
  (window as any).runGridBenchmarks = () => {
    const benchmark = new GridPerformanceBenchmark();
    return benchmark.runAllBenchmarks();
  };
  
  console.log('📈 Grid Performance Benchmark loaded!');
  console.log('Run: window.runGridBenchmarks() to test performance');
}

export default GridPerformanceBenchmark;
