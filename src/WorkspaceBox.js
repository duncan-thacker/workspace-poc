import React from "react";
import { Button } from "@material-ui/core";
import TextEditor from "./TextEditor";
import QueryPreview from "./QueryPreview";
import DraggablePart from "./DraggablePart";
import ResizeHandles from "./ResizeHandles";
import PersonCard from "./PersonCard";
import EventTimeline from "./EventTimeline";
import { EditorState } from "draft-js";
import ControlPanel from "./ControlPanel";
import moment from "moment";

import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import DiningIcon from "@material-ui/icons/LocalDining";
import GasStationIcon from "@material-ui/icons/LocalGasStation";
import BedIcon from "@material-ui/icons/LocalHotel";

export default function WorkspaceBox({ box, onRemove, onChange, onSelect, isSelected, containerElement }) {
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
        onChange({
            ...box,
            bounds: { ...box.bounds, ...newBounds }
        });
    }

    function handleSetTextBox() {
        onChange({
            ...box,
            type: "text",
            text: EditorState.createEmpty()
        });
    }

    function handleSetQueryBox() {
        onChange({
            ...box,
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

    function handleChangeView(changes) {
        if (box.query) {
            onChange({
                ...box,
                query: {
                    ...box.query,
                    view: {
                        ...box.query.view,
                        ...changes
                    }
                }
            });
        }
        if (box.card) {
            onChange({
                ...box,
                card: {
                    ...box.card,
                    view: changes.type
                }
            });
        }
    }

    function handleSetPersonCard() {
        onChange({
            ...box,
            type: "card",
            card: {
                title: "Winifred Skillets",
                bioSummary: "61-year-old female German national",
                description: "Friendly person with many interesting skills including jazz trombone, windsurfing, and speed chess.",
                location: [ 52.076, -0.42 ],
                image: "https://upload.wikimedia.org/wikipedia/en/f/f4/Winifred_Atwell.jpg",
                view: "image"
            }
        });
    }

    function handleSetTimeline() {
        onChange( {
            ...box,
            type: "timeline",
            timeline: [
                {
                    when: moment().subtract(2513, "minutes"),
                    Icon: MusicNoteIcon,
                    what: "Winifred sang a song"
                },
                {
                    when: moment().subtract(2123, "minutes"),
                    Icon: DiningIcon,
                    what: "Bob had some dinner"
                },
                {
                    when: moment().subtract(1889, "minutes"),
                    Icon: PhotoCameraIcon,
                    what: "Bob took a photo"
                },
                {
                    when: moment().subtract(1639, "minutes"),
                    Icon: PhotoCameraIcon,
                    what: "Winifred took a photo"
                },
                {
                    when: moment().subtract(1219, "minutes"),
                    Icon: GasStationIcon,
                    what: "Bob got some petrol"
                },
                {
                    when: moment().subtract(839, "minutes"),
                    Icon: PhotoCameraIcon,
                    what: "Bob took a photo"
                },
                {
                    when: moment().subtract(339, "minutes"),
                    Icon: BedIcon,
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
                        box.text && <TextEditor value={ box.text } onChange={ handleChangeText } />
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
                        isSelected && <ControlPanel box={ box } onChangeText={ handleChangeText } onChangeView={ handleChangeView } onRemove={ onRemove } />
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
        </>
    );
}
