import { useRef, useEffect } from "react";
import { useSpring, useMotionValue, motion } from "framer-motion";

const Magnet = ({ children, padding = 100, disabled = false }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const magnetRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (disabled || !magnetRef.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } =
        magnetRef.current.getBoundingClientRect();

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      if (Math.abs(distanceX) < padding && Math.abs(distanceY) < padding) {
        mouseX.set(distanceX);
        mouseY.set(distanceY);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, disabled, mouseX, mouseY]);

  return (
    <motion.div
      ref={magnetRef}
      style={{
        x: springX,
        y: springY,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
