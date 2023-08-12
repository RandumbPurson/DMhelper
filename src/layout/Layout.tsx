import { ReactNode } from "react";
import styled from "styled-components";

//#region Styling Containers
const Container = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
`;

const SidebarStyle = styled.div`
  width: 200px;
`;

const ContentStyle = styled.div`
  flex-grow: 1;
`;
//#endregion

//Props
interface Props {
  children: Array<ReactNode>;
}

// Component
function Layout({ children }: Props) {
  const [sidebar, content] = children;
  return (
    <Container>
      <SidebarStyle>{sidebar}</SidebarStyle>
      <ContentStyle>{content}</ContentStyle>
    </Container>
  );
}

export default Layout;
