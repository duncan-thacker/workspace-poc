import React, { useRef } from "react";
import { Toolbar, Button } from "@material-ui/core";
import { DraggableCore } from "react-draggable";
import { HORIZONTAL_RESIZER_LEFT, HORIZONTAL_RESIZER_RIGHT, HORIZONTAL_RESIZER_NONE, VERTICAL_RESIZER_BOTTOM, VERTICAL_RESIZER_TOP, VERTICAL_RESIZER_NONE } from "./resizers";
import TextEditor from "./TextEditor";
import { RichUtils } from "draft-js";

const CONTROL_PANEL_STYLE = {
    position: "absolute",
    right: 0,
    top: 0,
    transform: "translateY(-100%)",
    backgroundColor: "#adf",
    borderRadius: "2px",
    padding: 2
};

function isTextHighlighted(textState) {
    const selected = textState.getSelection();
    return selected.getStartOffset() !== selected.getEndOffset();
}

function ControlPanel({ onRemove, textBeingEdited, onChangeText }) {

    function handleBoldClick() {
        onChangeText(RichUtils.toggleInlineStyle(textBeingEdited, "BOLD"));
    }

    return (
        <Toolbar style={ CONTROL_PANEL_STYLE }>
            {
                textBeingEdited && <Button disabled={ !isTextHighlighted(textBeingEdited) } onClick={ handleBoldClick }>Bold</Button>
            }
            <Button style={ { userSelect: "none" } } onClick={ onRemove }>remove</Button>
            <Button className='drag-handle' style={ { cursor: "move", userSelect: "none" } }>move</Button>
        </Toolbar>
    );
}

function getRelativeMousePosition(mouseMoveEvent, boundingElement) {
    const boundingRectangle = boundingElement.getBoundingClientRect();
    return {
        posX: mouseMoveEvent.clientX - boundingRectangle.left,
        posY: mouseMoveEvent.clientY - boundingRectangle.top
    };
}


function DraggablePart({ children, onDrag, containerElement, relativeTo, ...props }) {
    const dragOriginRelativeToBox = useRef(undefined);

    const { top, left } = relativeTo;
    function handleDragStart(dragStartEvent) {
        const dragStartPosition = getRelativeMousePosition(dragStartEvent, containerElement);
        dragOriginRelativeToBox.current = {
            posX: dragStartPosition.posX - left,
            posY: dragStartPosition.posY - top
        };
    }

    function handleDrag(mouseMoveEvent) {
        const dragPosition = getRelativeMousePosition(mouseMoveEvent, containerElement);
        const newBoxPosition = {
            left: dragPosition.posX - dragOriginRelativeToBox.current.posX,
            top: dragPosition.posY - dragOriginRelativeToBox.current.posY
        };
        onDrag(newBoxPosition);
    }

    function handleDragStop() {
        dragOriginRelativeToBox.current = undefined;
    }

    return (
        <DraggableCore { ...props } bounds="parent" offsetParent={ containerElement } onDrag={ handleDrag } onStart={ handleDragStart } onStop={ handleDragStop }>
            { children }
        </DraggableCore>
    );
}

function ResizeHandle({ boxBounds, minHeight = 200, onResize, containerElement, resizerHorizontal, resizerVertical, sizeInPixels = 8, cursor = "move" }) {

    const handlePosition = {
        left: resizerHorizontal.getHandleLeft(boxBounds),
        top: resizerVertical.getHandleTop(boxBounds)
    };

    const handleElementPosition = {
        left: resizerHorizontal.getHandleElementLeft(boxBounds, sizeInPixels),
        top: resizerVertical.getHandleElementTop(boxBounds, sizeInPixels)
    };

    const handleStyle = {
        ...handleElementPosition,
        width: sizeInPixels,
        height: sizeInPixels,
        border: "1px solid #000",
        backgroundColor: "#fff",
        position: "absolute",
        zIndex: 400,
        boxSizing: "border-box",
        cursor
    };

    function handleDrag(newHandlePosition) {
        const updatedBounds = {
            left: resizerHorizontal.getUpdatedLeft(boxBounds, newHandlePosition, 200, minHeight),
            top: resizerVertical.getUpdatedTop(boxBounds, newHandlePosition, 200, minHeight),
            width: resizerHorizontal.getUpdatedWidth(boxBounds, newHandlePosition, 200, minHeight),
            height: resizerVertical.getUpdatedHeight(boxBounds, newHandlePosition, 200, minHeight)
        };
        onResize(updatedBounds);
    }

    return (
        <DraggablePart containerElement={ containerElement } relativeTo={ handlePosition } onDrag={ handleDrag }>
            <div style={ handleStyle }></div>
        </DraggablePart>
    );
}

function ResizeHandles({ boxBounds, minHeight, onResize, containerElement }) {
    return (
        <>
            <ResizeHandle minHeight={ minHeight } boxBounds={ boxBounds } resizerHorizontal={ HORIZONTAL_RESIZER_RIGHT } resizerVertical={ VERTICAL_RESIZER_BOTTOM } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle minHeight={ minHeight } boxBounds={ boxBounds } resizerHorizontal={ HORIZONTAL_RESIZER_LEFT } resizerVertical={ VERTICAL_RESIZER_BOTTOM } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle minHeight={ minHeight } boxBounds={ boxBounds } resizerHorizontal={ HORIZONTAL_RESIZER_RIGHT } resizerVertical={ VERTICAL_RESIZER_TOP } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle minHeight={ minHeight } boxBounds={ boxBounds } resizerHorizontal={ HORIZONTAL_RESIZER_LEFT } resizerVertical={ VERTICAL_RESIZER_TOP } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle minHeight={ minHeight } boxBounds={ boxBounds } cursor="ns-resize" resizerHorizontal={ HORIZONTAL_RESIZER_NONE } resizerVertical={ VERTICAL_RESIZER_BOTTOM } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle minHeight={ minHeight } boxBounds={ boxBounds } cursor="ns-resize" resizerHorizontal={ HORIZONTAL_RESIZER_NONE } resizerVertical={ VERTICAL_RESIZER_TOP } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle minHeight={ minHeight } boxBounds={ boxBounds } cursor="ew-resize" resizerHorizontal={ HORIZONTAL_RESIZER_RIGHT } resizerVertical={ VERTICAL_RESIZER_NONE } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle minHeight={ minHeight } boxBounds={ boxBounds } cursor="ew-resize" resizerHorizontal={ HORIZONTAL_RESIZER_LEFT } resizerVertical={ VERTICAL_RESIZER_NONE } containerElement={ containerElement } onResize={ onResize } />
        </>
    );
}

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

    return (
        <>
            <DraggablePart handle=".drag-handle" relativeTo={ box.bounds } containerElement={ containerElement } onDrag={ handleChangeBounds }>
                <div style={ style } onClick={ onSelect }>
                    {
                        box.text && <TextEditor value={ box.text } onChange={ handleChangeText } />
                    }
                    {
                        isSelected && <ControlPanel textBeingEdited={ box.text } onChangeText={ handleChangeText } onRemove={ onRemove } />
                    }
                </div>
            </DraggablePart>
            {
                isSelected && <ResizeHandles minHeight={ box.minHeight } boxBounds={ box.bounds } onResize={ handleChangeBounds } containerElement={ containerElement } />
            }
        </>
    );
}
