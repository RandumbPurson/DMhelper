import {
  DialogButton,
  WindowManager,
} from "../../components/dialogs/dialogUtils";
import { Dialog } from "../../components/dialogs/Dialog";
import { useContext, useEffect, useState } from "react";

const LoadDialog = () => {
  const { newWindow, setNewWindow } = useContext(WindowManager);
  const [sbNum, setSbNum] = useState(0);
  const [sbPath, setSbPath] = useState<string | null>(null);
  return (
    <>
      <button
        onClick={async () => {
          setSbPath(await window.fs.selectStatblock());
          console.log(sbPath);
        }}
      >
        Select
      </button>
      <p>{sbPath}</p>
      <input
        onChange={(e) => {
          setSbNum(parseInt(e.target.value));
        }}
        type="number"
      ></input>
      <button
        onClick={() => {
          window.combatManager.loadStatblock({ number: sbNum, path: sbPath });
          newWindow!.close();
          setNewWindow(null);
        }}
      >
        Submit
      </button>
    </>
  );
};

export const LoadButton = () => (
  <DialogButton text="Load">
    <LoadDialog />
  </DialogButton>
);
