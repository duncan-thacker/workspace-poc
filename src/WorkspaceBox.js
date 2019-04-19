import React from "react";
import { Button } from "@material-ui/core";
import TextEditor from "./TextEditor";
import QueryPreview from "./QueryPreview";
import DraggablePart from "./DraggablePart";
import ResizeHandles from "./ResizeHandles";
import PersonCard from "./PersonCard";
import { EditorState } from "draft-js";
import ControlPanel from "./ControlPanel";

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
                        isSelected && <ControlPanel box={ box } onChangeText={ handleChangeText } onChangeView={ handleChangeView } onRemove={ onRemove } />
                    }
                    {
                        !box.type && (
                            <>
                                <Button variant="contained" color="secondary" onClick={ handleSetTextBox }>Text</Button>
                                <Button variant="contained" color="secondary" onClick={ handleSetQueryBox }>Recent Query</Button>
                                <Button variant="contained" color="secondary" onClick={ handleSetPersonCard }>Person Card</Button>
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
