import React, { useRef } from "react";
import { Toolbar, Button } from "@material-ui/core";
import { DraggableCore } from "react-draggable";
import { HORIZONTAL_RESIZER_LEFT, HORIZONTAL_RESIZER_RIGHT, HORIZONTAL_RESIZER_NONE, VERTICAL_RESIZER_BOTTOM, VERTICAL_RESIZER_TOP, VERTICAL_RESIZER_NONE } from "./resizers";

const CONTROL_PANEL_STYLE = {
    position: "absolute",
    right: 0,
    top: 0,
    transform: "translateY(-100%)",
    backgroundColor: "#adf",
    borderRadius: "2px",
    padding: 2
};

function ControlPanel({ onRemove }) {
    return (
        <Toolbar style={ CONTROL_PANEL_STYLE }>
            <Button onClick={ onRemove }>remove</Button>
            <Button className='drag-handle' style={ { cursor: "move" } }>move</Button>
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

function ResizeHandle({ box, onResize, containerElement, resizerHorizontal, resizerVertical, sizeInPixels = 8, cursor = "move" }) {

    const handlePosition = {
        left: resizerHorizontal.getHandleLeft(box),
        top: resizerVertical.getHandleTop(box)
    };

    const handleElementPosition = {
        left: resizerHorizontal.getHandleElementLeft(box, sizeInPixels),
        top: resizerVertical.getHandleElementTop(box, sizeInPixels)
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
            left: resizerHorizontal.getUpdatedLeft(box, newHandlePosition, 200),
            top: resizerVertical.getUpdatedTop(box, newHandlePosition, 200),
            width: resizerHorizontal.getUpdatedWidth(box, newHandlePosition, 200),
            height: resizerVertical.getUpdatedHeight(box, newHandlePosition, 200)
        };
        onResize(updatedBounds);
    }

    return (
        <DraggablePart containerElement={ containerElement } relativeTo={ handlePosition } onDrag={ handleDrag }>
            <div style={ handleStyle }></div>
        </DraggablePart>
    );
}

function ResizeHandles({ box, onResize, containerElement }) {
    return (
        <>
            <ResizeHandle box={ box } resizerHorizontal={ HORIZONTAL_RESIZER_RIGHT } resizerVertical={ VERTICAL_RESIZER_BOTTOM } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle box={ box } resizerHorizontal={ HORIZONTAL_RESIZER_LEFT } resizerVertical={ VERTICAL_RESIZER_BOTTOM } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle box={ box } resizerHorizontal={ HORIZONTAL_RESIZER_RIGHT } resizerVertical={ VERTICAL_RESIZER_TOP } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle box={ box } resizerHorizontal={ HORIZONTAL_RESIZER_LEFT } resizerVertical={ VERTICAL_RESIZER_TOP } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle box={ box } cursor="ns-resize" resizerHorizontal={ HORIZONTAL_RESIZER_NONE } resizerVertical={ VERTICAL_RESIZER_BOTTOM } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle box={ box } cursor="ns-resize" resizerHorizontal={ HORIZONTAL_RESIZER_NONE } resizerVertical={ VERTICAL_RESIZER_TOP } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle box={ box } cursor="ew-resize" resizerHorizontal={ HORIZONTAL_RESIZER_RIGHT } resizerVertical={ VERTICAL_RESIZER_NONE } containerElement={ containerElement } onResize={ onResize } />
            <ResizeHandle box={ box } cursor="ew-resize" resizerHorizontal={ HORIZONTAL_RESIZER_LEFT } resizerVertical={ VERTICAL_RESIZER_NONE } containerElement={ containerElement } onResize={ onResize } />
        </>
    );
}

export default function WorkspaceBox({ box, onRemove, onChangeBounds, onSelect, isSelected, containerElement }) {
    //TODO fix box overflow by clipping
    const { top, left, width, height } = box;
    const style = {
        top,
        left,
        width,
        height,
        position: "absolute",
        backgroundColor: "#ddd",
        borderRadius: "2px",
        boxSizing: "border-box",
        border: isSelected ? "1px solid #888" : "none",
        boxShadow: isSelected ? "3px 3px 3px rgba(0,0,0,0.6)" : "none",
        zIndex: isSelected ? 300 : 0
    };

    return (
        <>
            <DraggablePart handle=".drag-handle" relativeTo={ box } containerElement={ containerElement } onDrag={ onChangeBounds }>
                <div style={ style } onClick={ onSelect }>
                    {
                        isSelected && <ControlPanel onRemove={ onRemove } />
                    }
                </div>
            </DraggablePart>
            {
                isSelected && <ResizeHandles box={ box } onResize={ onChangeBounds } containerElement={ containerElement } />
            }
        </>
    );
}
