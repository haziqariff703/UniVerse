import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const NumberTicker = ({ value, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    setHasAnimated(true);
    let startTime = null;
    const startValue = 0;
    const endValue = typeof value === "string" ? parseFloat(value) : value;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min(
        (currentTime - startTime) / (duration * 1000),
        1,
      );

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startValue + (endValue - startValue) * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration, hasAnimated]);

  const formatNumber = (num) => {
    if (suffix === "%") {
      return num.toFixed(0);
    }
    if (num >= 10000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    if (num >= 1000) {
      return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num.toFixed(0);
  };

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(count)}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};

export default NumberTicker;
