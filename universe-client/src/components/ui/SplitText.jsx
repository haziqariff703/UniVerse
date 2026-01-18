import { motion } from "framer-motion";

const SplitText = ({
  text = "",
  className = "",
  splitType = "words", // 'words' or 'chars'
  staggerDelay = 0.1,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  delay = 0,
}) => {
  const elements = splitType === "words" ? text.split(" ") : text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      ...to,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: from,
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ display: "inline-block" }}
    >
      {elements.map((el, index) => (
        <motion.span
          variants={child}
          style={{
            display: "inline-block",
            marginRight: splitType === "words" ? "0.25em" : "0",
          }}
          key={index}
        >
          {el}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default SplitText;
