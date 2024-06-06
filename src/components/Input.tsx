import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="bg-neutral-900 text-white border-[1px] border-red-500 px-2 py-1"
    />
  );
}

export default Input;
