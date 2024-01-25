import { traitsType } from "../../../types/statblockObjectTypes";

interface Props {
  traits: traitsType;
}

/* * #TODO
 * - Auto-Populated Traits
 * - React for loop?
 * */

function TraitBlock(
  {name, text, classes}: 
  {name: string, text: string, classes?: string}
) {
  if (typeof classes === "undefined") { classes = ""}
  return (
  <div key={name} className={"property-block " + classes!}>
    <h4>{name} </h4>
    <p>{text}</p>
  </div>)
}

const NAME = 0;
const TEXT = 1;

export default function SBTraits({ traits }: Props) {
  if (typeof traits.traits == "undefined") {return null}

  let traitPairs = Object.entries(traits.traits!)
  let numTraits = traitPairs.length

  if (numTraits == 0) {return null}
  if (numTraits == 1) {
    return <TraitBlock
      name={traitPairs[0][NAME]}
      text={traitPairs[0][TEXT]}
      classes="first last"
    />
  }

  let blocks = [
    <TraitBlock
      name={traitPairs[0][NAME]}
      text={traitPairs[0][TEXT]}
      classes="first"
    />
  ]
  for (let i=1; i < numTraits - 1; i++) {
    blocks.push(<TraitBlock
      name={traitPairs[i][NAME]}
      text={traitPairs[i][TEXT]}
    />)
  }
  blocks.push(<TraitBlock 
    name={traitPairs[numTraits-1][NAME]}
    text={traitPairs[numTraits-1][TEXT]}
  />)
  console.log(blocks)
  return <div>{blocks}</div>
} 
