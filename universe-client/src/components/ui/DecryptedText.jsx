import { useEffect, useState, useRef, useCallback } from "react";

const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection, // eslint-disable-line no-unused-vars
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOnHover = false,
  animateOn: _animateOn, // eslint-disable-line no-unused-vars
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  const getNextChar = useCallback(() => {
    if (useOriginalCharsOnly) {
      return text[Math.floor(Math.random() * text.length)];
    }
    return characters[Math.floor(Math.random() * characters.length)];
  }, [useOriginalCharsOnly, text, characters]);

  useEffect(() => {
    let iteration = 0;
    const reveal = () => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (iteration > maxIterations) return char;

            // Randomly decide if we stay encrypted or reveal
            const shouldReveal = sequential
              ? index < (iteration / maxIterations) * text.length
              : Math.random() < iteration / maxIterations;

            return shouldReveal ? char : getNextChar();
          })
          .join(""),
      );

      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current);
        setIsAnimating(false);
      }
      iteration++;
    };

    if (!animateOnHover || isHovering) {
      setIsAnimating(true);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(reveal, speed);
    } else {
      setDisplayText(text);
      setIsAnimating(false);
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [
    text,
    speed,
    maxIterations,
    sequential,
    isHovering,
    animateOnHover,
    getNextChar,
  ]);

  return (
    <span
      className={parentClassName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <span className={isAnimating ? encryptedClassName : className}>
        {displayText}
      </span>
    </span>
  );
};

export default DecryptedText;
