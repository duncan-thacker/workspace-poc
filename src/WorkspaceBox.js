import React from "react";
import { Button, Typography } from "@material-ui/core";
import TextEditor from "./TextEditor";
import QueryPreview from "./QueryPreview";
import DraggablePart from "./DraggablePart";
import ResizeHandles from "./ResizeHandles";
import PersonCard from "./PersonCard";
import EventTimeline from "./EventTimeline";
import ControlPanel from "./ControlPanel";

const onChange = () => {
    window.alert("not implemented");
};

function prFrom(array, seed) {
    return array[seed % array.length];
}

const FIRST_NAMES = ["Jacob", "Stephanie", "Boris", "Hugh", "Scott", "Maisy", "Donald", "Jeremy", "Thomas", "Percy", "Henry", "Mavis", "Rose", "Caitlin", "Spencer"];
const LAST_NAMES = ["Porter", "Cullen", "Edwards", "Roberts", "Smith", "Snow", "Stark", "Sixsmith", "Clark", "Winsfield", "Davies", "Masterson"];

function getUserName(userId) {
    const userIdNumber = parseInt(userId.replace(/-/g, ""), 16);
    return prFrom(FIRST_NAMES, Math.floor(userIdNumber/10000)) + " " + prFrom(LAST_NAMES, userIdNumber);
}

function OtherUserSelection({ userId, boxBounds }) {
    const { top, width, left, height } = boxBounds;
    const style = {
        position: "absolute",
        top: top + height,
        width: width + 3,
        left,
        pointerEvents: "none",
        display: "flex"
    };
    const tabStyle = {
        color: "#fff",
        marginLeft: "auto",
        backgroundColor: "#5c5",
        borderRadius: 4,
        pointerEvents: "default",
        padding: "2px 16px"
    };
    return (
        <div style={ style }>
            <Typography style={ tabStyle }>{ getUserName(userId) }</Typography>
        </div>
    );
}

export default function WorkspaceBox({ box, dispatch, onSelect, isSelected, containerElement, otherSelectors }) {
    //TODO fix box overflow by clipping
    const { top, left, width, height } = box.bounds;
    const style = {
        top,
        left,
        width,
        height,
        position: "absolute",
        backgroundColor: isSelected ? "#eee" : "transparent",
        borderRadius: "2px",
        boxSizing: "border-box",
        border: isSelected ? "1px solid #888" : "1px dotted #aaa",
        boxShadow: isSelected ? "3px 3px 3px rgba(0,0,0,0.6)" : "none",
        zIndex: isSelected ? 300 : 0
    };

    if (otherSelectors.length === 1) {
        style.outline = "3px solid #5c5";
    }

    function handleRemoveBox() {
        dispatch({
            type: "REMOVE_BOX",
            boxIdToRemove: box.id
        });
    }

    function handleChangeText(newText, editorHeight) {
        const newBounds = editorHeight > box.bounds.height ? { ...box.bounds, height: editorHeight } : box.bounds;
        onChange({
            ...box,
            text: newText,
            bounds: newBounds,
            minHeight: editorHeight
        });
    }

    function handleChangeBounds(newBounds) {
        dispatch({
            type: "UPDATE_BOX_BOUNDS",
            bounds: newBounds,
            boxIdToUpdate: box.id
        });
    }

    function handleSetBoxContents(contents) {
        dispatch({
            type: "UPDATE_BOX_CONTENTS",
            boxIdToUpdate: box.id,
            contents
        });
    }

    function handleSetTextBox() {
        onChange({
            type: "text",
            textBlocks: []
        });
    }

    function handleSetQueryBox() {
        handleSetBoxContents({
            type: "query",
            query: {
                parameters: {},
                results: {},
                view: {
                    type: "spreadsheet"
                }
            }
        });
    }

    function handleChangeView(newView) {
        if (box.query) {
            dispatch({
                type: "UPDATE_BOX_VIEW",
                boxIdToUpdate: box.id,
                field: "query",
                view: newView
            });
        }
        if (box.card) {
            dispatch({
                type: "UPDATE_BOX_VIEW",
                boxIdToUpdate: box.id,
                field: "card",
                view: newView
            });
        }
    }

    function handleSetPersonCard() {
        handleSetBoxContents({
            type: "card",
            card: {
                title: "Winifred Skillets",
                bioSummary: "61-year-old female German national",
                description: "Friendly person with many interesting skills including jazz trombone, windsurfing, and speed chess.",
                location: [ 52.076, -0.42 ],
                image: "https://upload.wikimedia.org/wikipedia/en/f/f4/Winifred_Atwell.jpg",
                view: {
                    type: "image"
                }
            }
        });
    }

    function handleSetTimeline() {
        handleSetBoxContents({
            type: "timeline",
            timeline: [
                {
                    when: 2513,
                    icon: "song",
                    what: "Winifred sang a song"
                },
                {
                    when: 2123,
                    icon: "food",
                    what: "Bob had some dinner"
                },
                {
                    when: 1889,
                    icon: "photo",
                    what: "Bob took a photo"
                },
                {
                    when: 1639,
                    icon: "photo",
                    what: "Winifred took a photo"
                },
                {
                    when: 1219,
                    icon: "petrol",
                    what: "Bob got some petrol"
                },
                {
                    when: 839,
                    icon: "photo",
                    what: "Bob took a photo"
                },
                {
                    when: 339,
                    icon: "sleep",
                    what: "Bob went to sleep"
                }
            ]
        });
    }

    return (
        <>
            <DraggablePart handle=".drag-handle" relativeTo={ box.bounds } containerElement={ containerElement } onDrag={ handleChangeBounds }>
                <div style={ style } onClick={ onSelect }>
                    {
                        box.textBlocks && <TextEditor value={ box.textBlocks } onChange={ handleChangeText } />
                    }
                    {
                        box.query && <QueryPreview { ...box.query } onChangeView={ handleChangeView } bounds={ box.bounds } />
                    }
                    {
                        box.card && <PersonCard bound={ box.bounds } card={ box.card } />
                    }
                    {
                        box.timeline && <EventTimeline bound={ box.bounds } timeline={ box.timeline } />
                    }
                    {
                        isSelected && <ControlPanel box={ box } onChangeText={ handleChangeText } onChangeView={ handleChangeView } onRemove={ handleRemoveBox } />
                    }
                    {
                        !box.type && (
                            <>
                                <Button variant="contained" color="secondary" onClick={ handleSetTextBox }>Text</Button>
                                <Button variant="contained" color="secondary" onClick={ handleSetQueryBox }>Recent Query</Button>
                                <Button variant="contained" color="secondary" onClick={ handleSetPersonCard }>Person Card</Button>
                                <Button variant="contained" color="secondary" onClick={ handleSetTimeline }>Timeline</Button>
                            </>
                        )
                    }
                </div>
            </DraggablePart>
            {
                isSelected && <ResizeHandles minHeight={ box.minHeight } boxBounds={ box.bounds } onResize={ handleChangeBounds } containerElement={ containerElement } />
            }
            {
                otherSelectors.length === 1 && <OtherUserSelection userId={ otherSelectors[0] } boxBounds={ box.bounds } />
            }
        </>
    );
}
