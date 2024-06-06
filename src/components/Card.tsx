"use client";

import { ReactNode } from "react";

interface Card {
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
}

function Card(props: React.PropsWithChildren<Card>) {
  return (
    <div
      className={
        "flex flex-col justify-between gap-2 border-[2px] p-2 w-[212px] h-[320px] " +
          props.className || ""
      }
      style={{
        borderLeftStyle: "dashed",
        borderRightStyle: "dashed",
      }}
    >
      {props.title && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-sm">{props.title}</h3>
          <hr />
        </div>
      )}
      <div className="max-w-48 break-words text-xs h-full flex flex-col">
        {props.description}
      </div>
      {props.children && (
        <div className="flex flex-col gap-2">
          <hr />
          <div className="flex flex-col gap-2 *:w-full">{props.children}</div>
        </div>
      )}
    </div>
  );
}

export default Card;
