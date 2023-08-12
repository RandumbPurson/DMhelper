import "./App.css";
import Layout from "./layout/Layout";

const Sidebar = () => <p>Sidebar</p>;
const Content = () => <p>Content</p>;

function App() {
  return (
    <>
      <Layout>
        <Sidebar />
        <Content />
      </Layout>
    </>
  );
}

export default App;
