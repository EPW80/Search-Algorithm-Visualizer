/**
 * Hook for exporting visualization as GIF
 * Uses canvas-based recording to capture algorithm animations
 */

import { useCallback, useRef, useState } from 'react';
import {
  AnimationSpeed,
  AnimationSpeedType,
} from '../helpers/animationHelpers';
import { CellState } from '../store/gridStore';
import { AlgorithmResult } from '../types';

interface GifFrame {
  imageData: ImageData;
  delay: number;
}

interface UseGifExportProps {
  grid: CellState[][];
  animationSpeed: AnimationSpeedType;
}

// Simple GIF encoder using canvas
// Note: For production, consider using a library like gif.js or modern-gif
const createGifBlob = async (
  frames: GifFrame[],
  width: number,
  height: number
): Promise<Blob> => {
  // Create a simple animated image by using canvas snapshots
  // This is a simplified approach - for full GIF support, use gif.js library
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx || frames.length === 0) {
    throw new Error('Cannot create GIF');
  }

  // For now, we'll create a WebM video which is more widely supported
  // and can be converted to GIF using external tools
  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 2500000,
  });

  const chunks: Blob[] = [];

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = reject;

    mediaRecorder.start();

    // Draw each frame
    let frameIndex = 0;
    const drawFrame = () => {
      if (frameIndex >= frames.length) {
        mediaRecorder.stop();
        return;
      }

      const frame = frames[frameIndex];
      if (frame) {
        ctx.putImageData(frame.imageData, 0, 0);
      }
      frameIndex++;
      setTimeout(drawFrame, frames[frameIndex - 1]?.delay ?? 100);
    };

    drawFrame();
  });
};

export const useGifExport = ({ grid, animationSpeed }: UseGifExportProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const framesRef = useRef<GifFrame[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Cell dimensions for rendering
  const CELL_SIZE = 15;
  const BORDER_SIZE = 1;

  // Colors for different cell states
  const COLORS = {
    empty: '#1a2744',
    wall: '#0a1628',
    start: '#22c55e',
    end: '#ec4899',
    visited: '#0ea5e9',
    path: '#06b6d4',
    border: '#00fff5',
  };

  // Initialize canvas
  const initCanvas = useCallback(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    canvasRef.current.width = cols * CELL_SIZE;
    canvasRef.current.height = rows * CELL_SIZE;
    ctxRef.current = canvasRef.current.getContext('2d');
  }, [grid]);

  // Draw the current state to canvas
  const drawGridToCanvas = useCallback(
    (visitedSet: Set<string>, pathSet: Set<string>) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      // Draw each cell
      for (let row = 0; row < grid.length; row++) {
        const gridRow = grid[row];
        if (!gridRow) continue;

        for (let col = 0; col < gridRow.length; col++) {
          const cell = gridRow[col];
          if (!cell) continue;

          const x = col * CELL_SIZE;
          const y = row * CELL_SIZE;
          const key = `${row},${col}`;

          // Determine color
          let color = COLORS.empty;
          if (cell.isStart) {
            color = COLORS.start;
          } else if (cell.isEnd) {
            color = COLORS.end;
          } else if (cell.isWall) {
            color = COLORS.wall;
          } else if (pathSet.has(key)) {
            color = COLORS.path;
          } else if (visitedSet.has(key)) {
            color = COLORS.visited;
          }

          // Fill cell
          ctx.fillStyle = color;
          ctx.fillRect(
            x + BORDER_SIZE,
            y + BORDER_SIZE,
            CELL_SIZE - BORDER_SIZE * 2,
            CELL_SIZE - BORDER_SIZE * 2
          );

          // Draw border
          ctx.strokeStyle = COLORS.border + '40';
          ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }
    },
    [grid]
  );

  // Capture a frame
  const captureFrame = useCallback((delay: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    framesRef.current.push({ imageData, delay });
  }, []);

  // Record algorithm execution
  const recordAlgorithm = useCallback(
    async (algorithmResult: AlgorithmResult): Promise<Blob | null> => {
      if (!algorithmResult.visited) return null;

      setIsRecording(true);
      setRecordingProgress(0);
      framesRef.current = [];
      initCanvas();

      const { visited, pathArray } = algorithmResult;
      const totalSteps = visited.length + (pathArray?.length ?? 0);
      const visitedSet = new Set<string>();
      const pathSet = new Set<string>();

      const frameDelay =
        animationSpeed === AnimationSpeed.INSTANT ? 50 : animationSpeed;

      try {
        // Capture initial state
        drawGridToCanvas(visitedSet, pathSet);
        captureFrame(frameDelay * 2);

        // Record visited nodes
        for (let i = 0; i < visited.length; i++) {
          const node = visited[i];
          if (node) {
            visitedSet.add(`${node[0]},${node[1]}`);
            drawGridToCanvas(visitedSet, pathSet);
            captureFrame(frameDelay);
          }
          setRecordingProgress(((i + 1) / totalSteps) * 100);
        }

        // Record path
        if (pathArray) {
          for (let i = 0; i < pathArray.length; i++) {
            const node = pathArray[i];
            if (node) {
              pathSet.add(`${node[0]},${node[1]}`);
              drawGridToCanvas(visitedSet, pathSet);
              captureFrame(frameDelay * 2);
            }
            setRecordingProgress(((visited.length + i + 1) / totalSteps) * 100);
          }
        }

        // Capture final state with longer delay
        captureFrame(frameDelay * 10);

        console.log(
          '🎬 Recording complete:',
          framesRef.current.length,
          'frames'
        );

        // Create the video/GIF blob
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const blob = await createGifBlob(
          framesRef.current,
          canvas.width,
          canvas.height
        );

        setIsRecording(false);
        setRecordingProgress(100);
        return blob;
      } catch (error) {
        console.error('Failed to record animation:', error);
        setIsRecording(false);
        return null;
      }
    },
    [animationSpeed, initCanvas, drawGridToCanvas, captureFrame]
  );

  // Export as downloadable file
  const exportVisualization = useCallback(
    async (algorithmResult: AlgorithmResult, algorithmName: string) => {
      const blob = await recordAlgorithm(algorithmResult);
      if (!blob) {
        console.error('Failed to create export');
        return false;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${algorithmName.toLowerCase().replace(/\s+/g, '-')}-visualization.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('📤 Visualization exported:', algorithmName);
      return true;
    },
    [recordAlgorithm]
  );

  // Quick capture of current grid state as PNG
  const captureGridImage = useCallback((): string | null => {
    initCanvas();
    drawGridToCanvas(new Set(), new Set());

    const canvas = canvasRef.current;
    if (!canvas) return null;

    return canvas.toDataURL('image/png');
  }, [initCanvas, drawGridToCanvas]);

  // Export current grid as PNG
  const exportGridImage = useCallback(
    (filename: string = 'grid') => {
      const dataUrl = captureGridImage();
      if (!dataUrl) return false;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('📸 Grid image exported:', filename);
      return true;
    },
    [captureGridImage]
  );

  return {
    isRecording,
    recordingProgress,
    recordAlgorithm,
    exportVisualization,
    captureGridImage,
    exportGridImage,
  };
};
