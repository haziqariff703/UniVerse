import React, { useRef, useEffect, useState, memo } from "react";

const Squares = ({
  direction = "right",
  speed = 1,
  borderColor = "#333",
  squareSize = 40,
  hoverFillColor = "#222",
  flickerProbability = 0.1, // New prop for random activity
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const numSquaresX = useRef();
  const numSquaresY = useRef();
  const gridOffset = useRef({ x: 0, y: 0 });
  const [hoveredSquare, setHoveredSquare] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      // Use offsetWidth/Height if available, else fallback to window inner dimensions
      // This solves the issue where offset is 0 on initial mount
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;

      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial call

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = borderColor;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          // Check if this square is hovered
          const isHovered =
            hoveredSquare &&
            Math.floor((x - startX) / squareSize) === hoveredSquare.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquare.y;

          // Random flicker effect
          const isFlickering = Math.random() < 0.001 * flickerProbability; // Low probability per frame

          if (isHovered || isFlickering) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed) % squareSize;
          break;
        default:
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed) % squareSize;
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    // Track mouse hover
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor(
        (mouseX + (gridOffset.current.x % squareSize)) / squareSize,
      );
      const hoveredSquareY = Math.floor(
        (mouseY + (gridOffset.current.y % squareSize)) / squareSize,
      );

      setHoveredSquare({ x: hoveredSquareX, y: hoveredSquareY });
    };

    const handleMouseLeave = () => {
      setHoveredSquare(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    direction,
    speed,
    borderColor,
    hoverFillColor,
    hoveredSquare,
    squareSize,
    flickerProbability,
  ]);

  return <canvas ref={canvasRef} className="w-full h-full border-none block" />;
};

export default memo(Squares);
