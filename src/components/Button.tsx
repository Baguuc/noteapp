"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "border" | "full" | "disabled";
}

function Button(props: ButtonProps) {
  const { variant, children, ...nativeProps } = props;

  return (
    <button
      {...nativeProps}
      className={
        "rounded-md text-xs text-white w-fit px-3 py-1 duration-100 hover:bg-opacity-75 hover:border-opacity-75 active:bg-opacity-15 active:border-opacity-15 " +
        (variant === "full" ? "bg-red-500 " : "") +
        (variant === "border" ? "border-[1px] border-red-500 " : "") +
        (variant === "disabled"
          ? "opacity-75 hover:bg-opacity-100 hover:border-opacity-7 active:bg-opacity-100 bg-red-500 hover:cursor-default "
          : "") +
        " " +
        nativeProps.className
      }
    >
      {children}
    </button>
  );
}

export default Button;
