import { DialogButton } from "../dialogs/dialogUtils";

import { Dices } from "lucide-react";

import "./Sidebar.css";
import RollInitiativeDialog from "../dialogs/RollInitiativeDialog";

export const RollInitiativeButton = () => (
  <DialogButton
    text={<Dices color="var(--primary)" />}
    className="headerButton"
  >
    <RollInitiativeDialog />
  </DialogButton>
);
