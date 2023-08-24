import {
  DialogButton,
  WindowManager,
  close,
} from "../../components/dialogs/dialogUtils";
import { useContext, useState } from "react";

async function selectPath(setter: (val: string) => void) {
  let defaultPath = await window.combatManager.getSetting(
    "defaultStatblockPath"
  );
  let selectedSb = await window.fs.selectStatblock({ defaultPath });
  setter(selectedSb);
}

function trimPath(path: string | null, start = "/", end = ".") {
  if (path !== null) {
    return path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
  }
}

const LoadDialog = () => {
  const windowManager = useContext(WindowManager);
  const [sbNum, setSbNum] = useState(0);
  const [sbPath, setSbPath] = useState<string | null>(null);
  return (
    <>
      <button onClick={async () => selectPath(setSbPath)}>Select</button>
      <p>{trimPath(sbPath)}</p>
      <input
        onChange={(e) => {
          setSbNum(parseInt(e.target.value));
        }}
        type="number"
      ></input>
      <button
        onClick={() => {
          window.combatManager.loadStatblock({ number: sbNum, path: sbPath });
          close(windowManager);
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
