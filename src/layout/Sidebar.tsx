import { ReactNode } from "react";
import styled from "styled-components";

//#region Styling Containers
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StaticButtons = styled.div`
  flex-shrink: 1;
  background-color: aliceblue;
`;

const DynamicButtons = styled.div``;

//#endregion

//props
interface Props {
  children: Array<ReactNode>;
}

// Component
function Sidebar({ staticButtons }: Props) {
  return <Container></Container>;
}
