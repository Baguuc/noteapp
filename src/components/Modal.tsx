import {
  DialogHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Button from "./Button";

interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
  modalContent: ReactNode;
}

function Modal(props: PropsWithChildren<ModalProps>) {
  const { modalContent, children, className, ...dialogProps } = props;

  const [closed, setClosed] = useState(true);

  function open() {
    setClosed(false);
  }

  function close() {
    setClosed(true);
  }

  useEffect(() => {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") {
          return;
        }

        close();
      },
      false
    );
  }, []);

  return (
    <>
      <div onClick={open} className={"w-full " + (className || "")}>
        {children}
      </div>
      <dialog
        {...dialogProps}
        className={
          "fixed top-0 left-0 w-screen h-screen bg-black/50 grid place-content-center " +
          (closed ? "hidden " : "")
        }
        onMouseDown={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }

          close();
        }}
      >
        <div
          className={
            "flex flex-col gap-2 border-[2px] p-4 border-spacing-4 bg-neutral-900 text-white w-[400px] " +
              className || ""
          }
          style={{
            borderLeftStyle: "dashed",
            borderRightStyle: "dashed",
          }}
        >
          <Button variant="full" className="w-full" onClick={close}>
            Close
          </Button>
          <hr />
          <div className="text-sm">{modalContent}</div>
        </div>
      </dialog>
    </>
  );
}

export default Modal;
