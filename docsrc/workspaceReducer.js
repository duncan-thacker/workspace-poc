function boxReducer(box, action) {
    if (action.type === "UPDATE_BOX_BOUNDS") {
        return {
            ...box,
            bounds: { ...box.bounds, ...action.bounds }
        };
    }
    if (action.type === "UPDATE_BOX_CONTENTS") {
        return {
            ...box,
            ...action.contents
        };
    }
    if (action.type === "UPDATE_BOX_VIEW") {
        const container = box[action.field];
        return {
            ...box,
            [action.field]: {
                ...container,
                view: { ...container.view, ...action.view }
            }
        };
    }
    throw new Error("Unknown action type " + action.type);
}

function sectionReducer(section, action) {
    if (action.type === "ADD_BOX") {
        return {
            ...section,
            boxes: [...section.boxes || [], action.boxToAdd]
        };
    }
    if (action.type === "REMOVE_BOX") {
        return {
            ...section,
            boxes: (section.boxes || []).filter(box => box.id !== action.boxIdToRemove)
        };
    }
    if (["UPDATE_BOX_BOUNDS", "UPDATE_BOX_CONTENTS", "UPDATE_BOX_VIEW"].includes(action.type)) {
        return {
            ...section,
            boxes: (section.boxes || []).map(box => {
                return box.id === action.boxIdToUpdate ? boxReducer(box, action) : box;
            })
        };
    }
    throw new Error("Unknown action type " + action.type);
}

export default function workspaceReducer(workspace, action) {
    if (action.type === "ADD_NEW_SECTION") {
        return {
            sections: [...workspace.sections, { name: action.name, id: action.id }]
        };
    }
    if (["ADD_BOX", "REMOVE_BOX", "UPDATE_BOX_BOUNDS", "UPDATE_BOX_CONTENTS", "UPDATE_BOX_VIEW"].includes(action.type)) {
        return {
            sections: workspace.sections.map(section => {
                return section.id === action.sectionId ? sectionReducer(section, action) : section;
            })
        };
    }
    throw new Error("Unknown action type " + action.type);
}
