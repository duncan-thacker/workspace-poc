import React, { useRef } from "react";
import { DraggableCore } from "react-draggable";

function getRelativeMousePosition(mouseMoveEvent, boundingElement) {
    const boundingRectangle = boundingElement.getBoundingClientRect();
    return {
        posX: mouseMoveEvent.clientX - boundingRectangle.left,
        posY: mouseMoveEvent.clientY - boundingRectangle.top
    };
}


export default function DraggablePart({ children, onDrag, containerElement, relativeTo, ...props }) {
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
