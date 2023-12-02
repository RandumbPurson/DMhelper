import Sidebar from "./Sidebar";
import Content from "./Content";

import "./Layout.css";

// Component
function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <Content />
    </div>
  );
}

export default Layout;
