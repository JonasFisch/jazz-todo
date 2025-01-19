import React, { useEffect } from "react";
import { useAnimate, motion } from "motion/react";
import { CheckOutlined } from "@ant-design/icons";

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

    console.log("checked: ", props.checked);
  }, [animate, props.checked]);

  return (
    <div className="relative h-4 w-4" ref={scope}>
      <motion.label
        id="check-box"
        htmlFor={props.id}
        style={{
          width: 16,
          height: 16,
          outline: "1px solid black",
          position: "absolute",
          top: 0,
          left: 0,
          boxShadow: "none",
        }}
        className="bg-white outline-1 outline-gray-600"
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
        <CheckOutlined />
      </motion.label>
      <input
        {...props}
        type="checkbox"
        hidden
        onChange={(event) => {
          props.onChange?.(event);
          console.log("changed", event.target.checked);
        }}
      />
    </div>
  );
}
