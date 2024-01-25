import { actionType } from "../../../../types/statblockObjectTypes";

interface Props {
    actions: {[key: string]: actionsType};
}

export default function Actions({actions}: Props) {
    return (<div className="actions">
        <h4>Actions</h4>


    </div>)
}

function ActionUses({action}:{action: actionType}) {
    if (action.uses && action.maxUses) {
        return (<div className="action-uses">
            <button className="action-use-btn">
                {action.uses}
            </button>
        </div>)
    }
    return null
}

function ActionBlock(
    {name, action}:
    {name: string, action: actionType}
) {
    return (<div className="property-block">
        <div className="action-header">
            <h4>{name} {ActionUses({action})}</h4>
        </div>
        <p>{action.text}</p>
    </div>)
}
