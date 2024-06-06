import React from "react";

interface TagProps {
  color: "red" | "green" | "yellow";
}

interface ColorScheme {
  bg: string;
  fg: string;
}

const red: ColorScheme = {
  bg: "bg-rose-800",
  fg: "border-pink-500",
};

const green: ColorScheme = {
  bg: "bg-green-800",
  fg: "border-emerald-500",
};

const yellow: ColorScheme = {
  bg: "bg-yellow-800",
  fg: "border-amber-500",
};

const colorPalette = {
  red,
  green,
  yellow,
} as const;

function Tag({ children, color }: React.PropsWithChildren<TagProps>) {
  const colorScheme: ColorScheme = colorPalette[color];

  return (
    <p
      className={`px-4 py-1 rounded-md border-2  ${colorScheme.bg} ${colorScheme.fg} w-fit text-xs`}
    >
      {children}
    </p>
  );
}

export default Tag;
