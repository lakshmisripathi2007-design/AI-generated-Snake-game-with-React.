import { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

export default function SnakeGame({ onScoreChange, isPaused }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const [isReady, setIsReady] = useState(false);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    const newFood = spawnFood([{ x: 10, y: 10 }]);
    setFood(newFood);
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setSpeed(INITIAL_SPEED);
    setIsReady(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'];
      if (keys.includes(e.key)) {
        e.preventDefault();
        setIsReady(true);
      }

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused || !isReady) return;

    const moveSnake = () => {
      setDirection(nextDirection);
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if ate food
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(spawnFood(newSnake));
          setSpeed(prevSpeed => Math.max(MIN_SPEED, prevSpeed - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, nextDirection, gameOver, score, speed, onScoreChange, spawnFood, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines subtly
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      // Flickering effect
      const flicker = Math.random() > 0.05 ? 1 : 0.5;
      ctx.globalAlpha = flicker;
      
      ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      
      // Draw a small "glitch" line off the head sometimes
      if (isHead && Math.random() > 0.9) {
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(segment.x * cellSize - 10, segment.y * cellSize + cellSize/2, 20, 1);
      }
    });
    ctx.globalAlpha = 1;

    // Draw food - square pixel glitch
    ctx.fillStyle = '#ff00ff';
    const foodPulse = Math.sin(Date.now() / 100) * 2;
    ctx.fillRect(
      food.x * cellSize + 2 - foodPulse,
      food.y * cellSize + 2 - foodPulse,
      cellSize - 4 + foodPulse * 2,
      cellSize - 4 + foodPulse * 2
    );

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-2 border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.2)]"
      />
      
      {(gameOver || isPaused || !isReady) && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center border-4 border-magenta/50">
          {gameOver ? (
            <>
              <h2 className="text-4xl font-mono text-magenta mb-4 glitch-text">SEGMENTATION_FAULT</h2>
              <p className="text-cyan mb-6 font-mono tracking-widest text-xl">SCORE: {score}</p>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-magenta text-black font-mono font-bold border-4 border-white hover:bg-cyan transition-colors"
              >
                REBOOT_SYSTEM
              </button>
            </>
          ) : isPaused ? (
            <>
              <h2 className="text-3xl font-mono text-cyan mb-4 glitch-text">PROCESS_HALTED</h2>
              <p className="text-magenta text-sm mb-6 font-mono">_WAITING_FOR_USER_INPUT_</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-mono text-white mb-4 animate-flicker tracking-widest">PRESS_KEY_TO_INITIALIZE</h2>
              <p className="text-cyan text-xs font-mono">_WAITING_FOR_INPUT_</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
