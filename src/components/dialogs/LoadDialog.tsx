import { WindowManager, close } from "./dialogUtils";
import { useContext, useState } from "react";

import { FolderSearch } from "lucide-react";

import styles from "./LoadDialog.css?inline";

async function selectPath(setter: (val: string) => void) {
  let defaultPath = await window.combatManager.getSetting(
    "defaultStatblockPath"
  );
  let selectedSb = await window.fs.selectStatblock({ defaultPath });
  setter(selectedSb);
}

function trimPath(path: string | null, start = "/", end = ".") {
  if (path != null) {
    return path.substring(path.lastIndexOf(start) + 1, path.lastIndexOf(end));
  }
}

export default function LoadDialog() {
  const windowManager = useContext(WindowManager);
  const [sbNum, setSbNum] = useState(0);
  const [sbPath, setSbPath] = useState<string | null>(null);
  return (
    <div className={styles.loadDialog}>
      <div>
        <p>{trimPath(sbPath)}</p>
        <button autoFocus onClick={async () => selectPath(setSbPath)}>
          {<FolderSearch />}
        </button>
      </div>

      <div className="numSubmit">
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
      </div>
    </div>
  );
}

// <button onClick={() => close(windowManager)}>Close</button>
