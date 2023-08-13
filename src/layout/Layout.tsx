import "./Layout.css";

import Sidebar from "./Sidebar";
import Content from "./Content";

// Component
function Layout() {
  return (
    <div className="container">
      <Sidebar />
      <Content />
    </div>
  );
}

export default Layout;
