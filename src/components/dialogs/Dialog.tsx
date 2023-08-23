interface Props {
  text: string;
}

function Dialog({ text }: Props) {
  return (
    <>
      <p>{text}</p>
    </>
  );
}

export default Dialog;
