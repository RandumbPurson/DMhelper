import {
  DialogButton,
  WindowManager,
} from "../../components/dialogs/dialogUtils";
import { useContext, useState } from "react";

const LoadDialog = () => {
  const { newWindow, setNewWindow } = useContext(WindowManager);
  const [sbNum, setSbNum] = useState(0);
  const [sbPath, setSbPath] = useState<string | null>(null);
  return (
    <>
      <button
        onClick={async () => {
          let defaultPath = await window.combatManager.getSetting(
            "defaultStatblockPath"
          );
          let selectedSb = await window.fs.selectStatblock({ defaultPath });
          setSbPath(selectedSb);
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
