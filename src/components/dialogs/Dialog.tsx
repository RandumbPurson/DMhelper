import { createPortal } from "react-dom";
import { ReactNode } from "react";

interface Props {
  text: string;
}

export function Dialog({ text }: Props) {
  return (
    <>
      <p>{text}</p>
    </>
  );
}

/** Helper function to create new window and
 * get its body after it loads.
 */
export function getNewDialogBody(
  path: string,
  setter: (a: HTMLElement) => void
) {
  const newDialog = window.open(path)!;
  newDialog.onload = () => {
    setter(newDialog.document.body);
  };
}

/** Helper function to set content in a dialog*/
export function setNewDialogContent(
  newDialogBody: HTMLElement | null,
  content: ReactNode
) {
  if (newDialogBody !== null) {
    return createPortal(content, newDialogBody);
  }
}
