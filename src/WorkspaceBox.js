import React, { useRef } from "react";
import { Toolbar, Button } from "@material-ui/core";
import { DraggableCore } from "react-draggable";

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
            <Button className='drag-handle'>move</Button>
        </Toolbar>
    );
}

function ResizeHandle({ position, onResize, containerElement, sizeInPixels = 8 }) {
    const style = {
        ...position,
        width: sizeInPixels,
        height: sizeInPixels,
        border: "1px solid #000",
        backgroundColor: "#fff",
        position: "absolute"
    };
    return (
        <DraggableCore bounds="parent" offsetParent={ containerElement } onDrag={ onResize }>
            <div style={ style }></div>
        </DraggableCore>
    );
}

function ResizeHandles({ box, onResize, containerElement }) {
    const bottomRightCorner = {
        left: box.left + box.width,
        top: box.top + box.height
    };
    return (
        <ResizeHandle position={ bottomRightCorner } containerElement={ containerElement } onResize={ onResize } />
    );
}

function getRelativeMousePosition(mouseMoveEvent, boundingElement) {
    const boundingRectangle = boundingElement.getBoundingClientRect();
    return {
        posX: mouseMoveEvent.clientX - boundingRectangle.left,
        posY: mouseMoveEvent.clientY - boundingRectangle.top
    };
}

export default function WorkspaceBox({ box, onRemove, onResize, onMove, onSelect, isSelected, containerElement }) {
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

    const dragOriginRelativeToBox = useRef(undefined);

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
        onMove(newBoxPosition);
    }

    function handleDragStop() {
        dragOriginRelativeToBox.current = undefined;
    }

    return (
        <>
            <DraggableCore handle=".drag-handle" bounds="parent" offsetParent={ containerElement } onDrag={ handleDrag } onStart={ handleDragStart } onStop={ handleDragStop }>
                <div style={ style } onClick={ onSelect }>
                    {
                        isSelected && <ControlPanel onRemove={ onRemove } />
                    }
                </div>
            </DraggableCore>
            {
                isSelected && <ResizeHandles box={ box } onResize={ onResize } containerElement={ containerElement } />
            }
        </>
    );
}
