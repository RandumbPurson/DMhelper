import {
  Dialog,
  getNewDialogBody,
  setNewDialogContent,
} from "../dialogs/Dialog";
import { useState } from "react";

function LoadButton() {
  const [newDialogBody, setNewDialogBody] = useState<HTMLElement | null>(null);

  return (
    <>
      <button onClick={() => getNewDialogBody("dialog.html", setNewDialogBody)}>
        Load
      </button>
      {setNewDialogContent(newDialogBody, <Dialog text="Test3" />)}
    </>
  );
}

export default LoadButton;
