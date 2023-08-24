import { ReactNode } from "react";

interface Props {
  text: string;
  children?: ReactNode;
}

export function Dialog({ text, children }: Props) {
  return (
    <>
      <p>{text}</p>
      {children}
    </>
  );
}
