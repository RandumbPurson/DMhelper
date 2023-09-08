import { createContext, useState } from "react";
import Layout from "./layout/Layout";

type appManagerType = {
  statblockData: { [key: string]: any } | {};
  updateStatblock: Function;
};
export const AppManager = createContext<appManagerType>({
  statblockData: {},
  updateStatblock: () => {},
});

function App() {
  const [statblockData, setStatblockData] = useState({});
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
