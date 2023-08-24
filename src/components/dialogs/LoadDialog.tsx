import { WindowManager, useClickOff } from "./dialogUtils";
import { useContext, useRef, useState } from "react";

import { FolderSearch } from "lucide-react";

import "./LoadDialog.css";
import { StatblockRenderManager } from "../../layout/Sidebar";

async function selectPath(setter: (val: string) => void) {
  let defaultPath = await window.combatManager.getSetting(
    "defaultStatblockPath"
  );
  let selectedSb = await window.fs.selectStatblock({ defaultPath });
  setter(selectedSb);
}

export function trimPath(path: string | null, start = "/", end = ".") {
  if (path != null) {
    return path.substring(path.lastIndexOf(start) + 1, path.lastIndexOf(end));
  }
}

export default function LoadDialog() {
  const { overlayRef, setIsOpen } = useContext(WindowManager);
  const { renderData, setRenderData } = useContext(StatblockRenderManager);

  const [sbNum, setSbNum] = useState(1);
  const [sbPath, setSbPath] = useState<string>(" ");

  const boxRef = useRef<HTMLDivElement>(null);

  useClickOff(
    overlayRef!,
    boxRef,
    () => setIsOpen(false),
    async () => selectPath(setSbPath)
  );

  return (
    <div className="loadDialog" ref={boxRef}>
      <p className="fileDisplay">{trimPath(sbPath)}</p>
      <div className="numSubmit">
        <button
          autoFocus
          onClick={async () => selectPath(setSbPath)}
          className="fileSelector"
        >
          {<FolderSearch />}
        </button>
        <input
          onChange={(e) => {
            setSbNum(parseInt(e.target.value));
          }}
          type="number"
          className="numInput"
          placeholder="# of creature"
        ></input>
        <button
          onClick={async () => {
            window.combatManager.loadStatblock({ number: sbNum, path: sbPath });
            setRenderData(await window.combatManager.getRenderData());
            setIsOpen(false);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

// <button onClick={() => close(windowManager)}>Close</button>
