import {
  ReactNode,
  RefObject,
  createContext,
  useRef,
  useEffect,
  useState,
} from "react";

import "./Dialogs.css";

interface windowManagerValues {
  overlayRef: RefObject<HTMLDivElement> | null;
  setIsOpen: Function;
}

export const WindowManager = createContext<windowManagerValues>({
  overlayRef: null,
  setIsOpen: () => {},
});

type Props = {
  text: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DialogButton({ text, children, className = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);

  return (
    <WindowManager.Provider value={{ overlayRef, setIsOpen }}>
      <button className={className} onClick={() => setIsOpen(true)}>
        {text}
      </button>
      {isOpen ? (
        <div className="overlay" ref={overlayRef}>
          {children}
        </div>
      ) : null}
    </WindowManager.Provider>
  );
}

export function useClickOff(
  overlayRef: RefObject<HTMLDivElement>,
  boxRef: RefObject<HTMLDivElement>,
  onClose: (event: Object) => void,
  onOpen: () => void = () => {}
) {
  useEffect(() => {
    onOpen();
    overlayRef.current!.addEventListener("click", (e) => {
      const dialogDimensions = boxRef.current!.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        onClose(e);
      }
    });
  }, []);
}
