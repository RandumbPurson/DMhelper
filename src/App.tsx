import { createContext, useState } from "react";
import Layout from "./layout/Layout";
import { statblockType } from "../types/statblockObjectTypes";

type appManagerType = {
  statblockData: statblockType | null;
  updateStatblock: Function;
};
export const AppManager = createContext<appManagerType>({
  statblockData: null,
  updateStatblock: () => {},
});

function App() {
  const [statblockData, setStatblockData] = useState(null);
  return (
    <AppManager.Provider
      value={{
        statblockData: statblockData,
        updateStatblock: setStatblockData,
      }}
    >
      <Layout />;
    </AppManager.Provider>
  );
}

export default App;
