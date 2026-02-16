import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        animate={animate ? "animate" : undefined}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform",
          " bg-[radial-gradient(circle_farthest-side_at_0_100%,#7c3aed,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7c3aed,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#fbbf24,transparent),radial-gradient(circle_farthest-side_at_0_0,#4c1d95,transparent)]",
        )}
        initial={animate ? "initial" : undefined}
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }
            : undefined
        }
        variants={animate ? variants : undefined}
      />
      <motion.div
        animate={animate ? "animate" : undefined}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#7c3aed,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7c3aed,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#fbbf24,transparent),radial-gradient(circle_farthest-side_at_0_0,#4c1d95,transparent)]",
        )}
        initial={animate ? "initial" : undefined}
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }
            : undefined
        }
        variants={animate ? variants : undefined}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
