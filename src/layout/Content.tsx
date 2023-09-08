import { useContext } from "react";
import Statblock from "../components/Statblock";
import { AppManager } from "../App";

interface Props {}

function Content({}: Props) {
  const { updateStatblock } = useContext(AppManager);
  return (
    <div className="content">
      <Statblock />
    </div>
  );
}

export default Content;
