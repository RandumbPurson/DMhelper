import { createPortal } from "react-dom";
import { ReactNode, createContext, useState } from "react";

interface windowManagerValues {
  newWindow: Window | null;
  setNewWindow: (val: Window | null) => void;
}

export const WindowManager = createContext<windowManagerValues>({
  newWindow: null,
  setNewWindow: () => {},
});

export function close({ newWindow, setNewWindow }: windowManagerValues) {
  newWindow!.close();
  setNewWindow(null);
}

type Props = {
  text: string;
  children: ReactNode;
};

export function DialogButton({ text, children }: Props) {
  const [newDialogWindow, setNewDialogWindow] = useState<Window | null>(null);

  return (
    <>
      <button
        onClick={() => getNewDialogWindow("dialog.html", setNewDialogWindow)}
      >
        {text}
      </button>
      {setNewDialogContent(newDialogWindow, setNewDialogWindow, children)}
    </>
  );
}

/** Helper function to create new window and
 * get its body after it loads.
 */
export function getNewDialogWindow(
  path: string,
  setter: (a: Window) => void,
  name: string = "Dialog"
) {
  const newDialog = window.open(
    path,
    name,
    "width=300,height=100,frame=false"
  )!;
  newDialog.onload = () => {
    setter(newDialog);
  };
}

/** Helper function to set content in a dialog*/
export function setNewDialogContent(
  newDialogWindow: Window | null,
  newDialogWindowSetter: (val: Window | null) => void,
  content: ReactNode
) {
  if (newDialogWindow !== null) {
    return (
      <>
        <WindowManager.Provider
          value={{
            newWindow: newDialogWindow,
            setNewWindow: newDialogWindowSetter,
          }}
        >
          {createPortal(content, newDialogWindow.document.body)}
        </WindowManager.Provider>
      </>
    );
  }
}
