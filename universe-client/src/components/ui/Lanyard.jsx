import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const Lanyard = ({ children }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || !cardRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Constraint = Matter.Constraint,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

    const engine = Engine.create({
      positionIterations: 8,
      velocityIterations: 8,
    });
    const world = engine.world;

    // Adjust opacity for visual debugging if needed
    // const render = Render.create({
    //   element: containerRef.current,
    //   engine: engine,
    //   canvas: canvasRef.current,
    //   options: {
    //     width: containerRef.current.clientWidth,
    //     height: containerRef.current.clientHeight,
    //     background: 'transparent',
    //     wireframes: false,
    //     showAngleIndicator: false
    //   }
    // });

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Create the tether (string)
    // A chain of small rendering-only bodies or just constraints?
    // Let's use a composite stack for the rope
    const group = Body.nextGroup(true);
    const ropeSegments = 10;
    const ropeLength = 200; // Total length
    const segmentLength = 18; // Reduced slightly to ensure it looks tight (was 20)

    // Stack vertically: 1 column, ropeSegments rows
    const rope = Composites.stack(
      width / 2,
      0,
      1,
      ropeSegments,
      0,
      0,
      (x, y, i) => {
        return Bodies.rectangle(x, y, 2, segmentLength, {
          isStatic: i === 0, // Pivot point is static!
          collisionFilter: { group: group },
          render: { visible: false }, // We draw it manually
        });
      },
    );

    Composites.chain(rope, 0.5, 0, -0.5, 0, {
      stiffness: 1,
      damping: 0.2, // More damping to stop oscillation
      length: 5, // Small non-zero length can help stability
      render: { type: "line" },
    });

    // The FIRST body is now static, so we don't need a pin constraint to hold it.
    // However, we need to update its position on resize.

    // The Card Body
    // We make a sensor body that the DOM element will follow
    const cardWidth = 300;
    const cardHeight = 450;
    const cardBody = Bodies.rectangle(
      width / 2,
      ropeLength + cardHeight / 2,
      cardWidth,
      cardHeight,
      {
        collisionFilter: { group: group },
        chamfer: { radius: 20 },
        density: 0.005,
        frictionAir: 0.05,
        render: { visible: false }, // We use the DOM element
      },
    );

    // Connect rope to card
    const cardConnector = Constraint.create({
      bodyA: rope.bodies[rope.bodies.length - 1],
      bodyB: cardBody,
      pointA: { x: 0, y: segmentLength / 2 },
      pointB: { x: 0, y: -cardHeight / 2 + 20 }, // Attach slightly inside top
      stiffness: 1,
      damping: 0.1,
    });

    Composite.add(world, [rope, cardBody, cardConnector]);

    // Mouse Control
    const mouse = Mouse.create(containerRef.current); // Use container for mouse events
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    // Fix scroll issues by not capturing scroll events
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    Composite.add(world, mouseConstraint);

    // Runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Custom Render Loop
    let animationFrameId;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx || !cardRef.current) return;

      // Handle High DPI and Resize
      const rect = containerRef.current.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        width = rect.width;
        height = rect.height;

        // Update pin position on resize
        // Re-center static top body
        Body.setPosition(rope.bodies[0], { x: width / 2, y: 0 });
      }

      ctx.clearRect(0, 0, width, height);

      // Draw Rope
      ctx.beginPath();
      // Start from pin
      ctx.moveTo(width / 2, 0);

      // Curve through bodies
      rope.bodies.forEach((body) => {
        ctx.lineTo(body.position.x, body.position.y);
      });

      // Determine color based on CSS variable or check document class
      // Simple hack: Check if we are in dark mode via class on html/body
      const isDark = document.documentElement.classList.contains("dark");
      ctx.strokeStyle = isDark
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();

      // specific styles for rope connector
      // Draw a little circle at the top
      ctx.beginPath();
      ctx.arc(width / 2, 0, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#7c3aed";
      ctx.fill();

      // Sync DOM Card Position & Rotation
      const { x, y } = cardBody.position;
      const angle = cardBody.angle;

      cardRef.current.style.transform = `translate(${x - cardWidth / 2}px, ${
        y - cardHeight / 2
      }px) rotate(${angle}rad)`;

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(world);
      Mouse.clearSourceEvents(mouse);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[600px] flex justify-center bg-transparent z-10"
      style={{ touchAction: "none" }} // Important for dragging
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div
        ref={cardRef}
        className="absolute will-change-transform cursor-grab active:cursor-grabbing"
        style={{
          width: "300px",
          height: "450px",
          transformOrigin: "50% 50%",
          left: 0,
          top: 0,
        }}
      >
        {/* Card Content - Passed as children */}
        <div className="w-full h-full bg-card rounded-[20px] shadow-2xl border border-border overflow-hidden relative group">
          {/* Gloss Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-20" />

          {/* Lanyard Hole Mockup */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/20 dark:bg-black/40 rounded-full z-20 blur-[1px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-16 pointer-events-none z-20 flex justify-center">
            {/* Clip */}
            <div className="w-8 h-8 rounded-full border-4 border-[#7c3aed]/50 bg-transparent mt-[-10px]" />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Lanyard;
