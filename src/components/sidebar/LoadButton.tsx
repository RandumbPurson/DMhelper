import LoadDialog from "../dialogs/LoadDialog";
import { DialogButton } from "../dialogs/dialogUtils";

import { CopyPlus } from "lucide-react";

import "./Sidebar.css";

export const LoadButton = () => (
  <DialogButton
    text={<CopyPlus color="var(--primary)" />}
    className="headerButton"
  >
    <LoadDialog />
  </DialogButton>
);
