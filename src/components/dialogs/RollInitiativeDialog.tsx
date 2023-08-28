import { WindowManager, useClickOff } from "./dialogUtils";
import { ReactNode, useContext, useReducer, useRef, useState } from "react";

import { StatblockRenderManager } from "../../layout/Sidebar";

import "./RollInitiativeDialog.css";

function displayNElems(n: number, content: ReactNode, divClass: string = "") {
  let elemArr: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    elemArr.push(
      <KeyedDiv id={i.toString()} key={i.toString()} className={divClass}>
        {content}
      </KeyedDiv>
    );
  }
  return elemArr;
}

function KeyedDiv({
  id,
  className = "",
  children,
}: {
  id: string;
  className: string;
  children?: ReactNode;
}) {
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
}
type infoReducerState = {
  [key: string]: {
    name: string;
    initiative: string;
  };
};
type infoReducerAction =
  | { type: "resetToNum"; num: number }
  | { type: "changeName"; playerID: string; newName: string }
  | { type: "changeInitiative"; playerID: string; newInitiative: string };
function playerInfoReducer(state: infoReducerState, action: infoReducerAction) {
  switch (action.type) {
    case "resetToNum": {
      let base: infoReducerState = {};
      for (let i = 0; i < action.num!; i++) {
        base[i] = { name: "", initiative: "0" };
      }
      return base;
    }
    case "changeName": {
      const playerID = action.playerID;
      const playerInit = state[playerID].initiative;
      console.log(playerInit);
      return {
        ...state,
        [playerID]: {
          name: action.newName,
          initiative: playerInit,
        },
      };
    }
    case "changeInitiative": {
      const playerID = action.playerID;
      const playerName = state[playerID].name;
      console.log(playerName);
      return {
        ...state,
        [playerID]: {
          name: playerName,
          initiative: action.newInitiative,
        },
      };
    }
  }
}

/**TODO
 * - Add functionality
 * - Extract Dialog component for reuse
 * - Style
 */
export default function RollInitiativeDialog() {
  const { overlayRef, setIsOpen } = useContext(WindowManager);
  const { renderData, setRenderData } = useContext(StatblockRenderManager);

  const boxRef = useRef<HTMLDivElement>(null);
  useClickOff(overlayRef!, boxRef, () => setIsOpen(false));

  const [numPlayers, setNumPlayers] = useState(0);
  const [playerInfo, playerDispatch] = useReducer(playerInfoReducer, {});

  return (
    <div className="rollInitiativeDialog" ref={boxRef}>
      <div className="numPlayersInputDiv">
        <label htmlFor="numPlayersInput"></label>
        <input
          type="number"
          id="numPlayersInput"
          className="numPlayersInput"
          onChange={(e) => {
            setNumPlayers(parseInt(e.target.value));
            playerDispatch({
              type: "resetToNum",
              num: parseInt(e.target.value),
            });
          }}
        ></input>
      </div>
      {displayNElems(
        numPlayers,
        <>
          <input
            placeholder="Name"
            onChange={(e) => {
              playerDispatch({
                type: "changeName",
                playerID: e.target.parentElement!.id,
                newName: e.target.value,
              });
            }}
          ></input>
          <input
            type="number"
            placeholder="Initiative"
            onChange={(e) => {
              playerDispatch({
                type: "changeInitiative",
                playerID: e.target.parentElement!.id,
                newInitiative: e.target.value,
              });
            }}
          ></input>
        </>,
        "playerInitiativeDiv"
      )}
      <button
        onClick={() => {
          /** TODO
           * Implement initiative rolling
           * - initiative roll API call
           * - player initiative
           */
          setIsOpen(false);
        }}
      >
        Submit
      </button>
      <button
        onClick={() => {
          setIsOpen(false);
        }}
      >
        close
      </button>
    </div>
  );
}
