import React from "react";
import { HORIZONTAL_RESIZER_LEFT, HORIZONTAL_RESIZER_RIGHT, HORIZONTAL_RESIZER_NONE, VERTICAL_RESIZER_BOTTOM, VERTICAL_RESIZER_TOP, VERTICAL_RESIZER_NONE } from "./resizers";
import DraggablePart from "./DraggablePart";

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

export default function ResizeHandles({ boxBounds, minHeight, onResize, containerElement }) {
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

