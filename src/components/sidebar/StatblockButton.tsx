interface Props {
  data: {
    name: string;
    uid: number;
    initiative: number;
  };
}

function StatblockButton({ data }: Props) {
  let { name, uid, initiative } = data;
  return (
    <div className="statblockButtonDiv">
      <button
        onClick={() => {
          window.combatManager.setSelectedStatblock(name, uid);
        }}
        className="statblockMainButton"
      >
        <div className="sbName">{name}</div>
        <div className="sbID">{uid}</div>
      </button>
      <button className="statblockInitButton">
        {initiative ? initiative : null}
      </button>
    </div>
  );
}

export default StatblockButton;
