import React, { useEffect } from "react";
import { useAnimate, motion } from "motion/react";
import { CheckIcon } from "lucide-react";

export function AnimatedInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { id: string }
) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const showCircle = props.checked ? 1 : 0;
    const showBox = props.checked ? 0 : 1;

    animate(
      "#check-circle",
      { opacity: showCircle, scale: showCircle },
      { bounce: 0.3 }
    );
    animate(
      "#check-box",
      { opacity: showBox, scale: showBox },
      { bounce: 0.3 }
    );
  }, [animate, props.checked]);

  return (
    <div className="relative h-4 w-4" ref={scope}>
      <motion.label
        id="check-box"
        htmlFor={props.id}
        style={{
          width: 16,
          height: 16,
          position: "absolute",
          top: 0,
          left: 0,
          boxShadow: "none",
          borderRadius: 3,
        }}
        className="bg-transparent border-foreground border-1 border-solid border"
      />
      <motion.label
        id="check-circle"
        htmlFor={props.id}
        initial={{ opacity: 0, scale: 0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          margin: "auto",
          zIndex: 10,
          width: 16,
          height: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckIcon />
      </motion.label>
      <input
        {...props}
        type="checkbox"
        hidden
        onChange={(event) => props.onChange?.(event)}
      />
    </div>
  );
}
