async function loadStatblock() {
  window.win.newModal();
  //let statblock = await window.fs.selectStatblock();
  //console.log(statblock);
}

function LoadButton() {
  return <button onClick={loadStatblock}>Load</button>;
}

export default LoadButton;
