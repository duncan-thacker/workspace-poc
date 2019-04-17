import React, { useState, useRef } from "react";
import { Typography } from "@material-ui/core";

function clamp(valueToClamp, maxValue, snapTolerance = 0) {
    if (valueToClamp < snapTolerance) {
        return 0;
    }
    if (Math.abs(valueToClamp-maxValue) < snapTolerance) {
        return maxValue;
    }
    return Math.min(Math.max(valueToClamp, 0), maxValue);
}

function getRelativeMousePosition(mouseMoveEvent, boundingElement, snapTolerance) {
    const boundingRectangle = boundingElement.getBoundingClientRect();
    const boundingWidth = boundingRectangle.right - boundingRectangle.left;
    const boundingHeight = boundingRectangle.bottom - boundingRectangle.top;
    const relativeX = mouseMoveEvent.clientX - boundingRectangle.left;
    const relativeY = mouseMoveEvent.clientY - boundingRectangle.top;
    return {
        posX: clamp(relativeX, boundingWidth, snapTolerance),
        posY: clamp(relativeY, boundingHeight, snapTolerance)
    };
}

function respectMinimumSize(position, { startX, startY }, minimumSize) {
    const deltaX = position.posX - startX;
    const deltaY = position.posY - startY;
    const requiredDeltaX = deltaX > 0 ? Math.max(deltaX, minimumSize) : Math.min(deltaX, -minimumSize);
    const requiredDeltaY = deltaY > 0 ? Math.max(deltaY, minimumSize) : Math.min(deltaY, -minimumSize);
    return {
        posX: startX + requiredDeltaX,
        posY: startY + requiredDeltaY
    };
}

function WorkspaceToolbar() {
    return false;
}

function DrawBox( { box } ) {
    //TODO fix box overflow by clipping
    const { startX, startY, endX, endY } = box;
    const style = {
        left: Math.min(startX, endX),
        top: Math.min(startY, endY),
        width: Math.abs(startX - endX),
        height: Math.abs(startY - endY),
        position: "absolute",
        pointerEvents: "none",
        border: "3px dashed #000",
        boxSizing: "border-box"
    };
    return <div style={ style } />;
}

function Workspace({ style, value, onChange }) {

    const [ drawBoxState, setDrawBoxState ] = useState(undefined);
    const containerRef = useRef(null);

    function handleDrawStart(drawStartEvent) {
        setDrawBoxState({
            startX: drawStartEvent.clientX,
            startY: drawStartEvent.clientY,
            endX: drawStartEvent.clientX,
            endY: drawStartEvent.clientY,
        });
    }

    function handleMouseMove(mouseMoveEvent) {
        //TODO use state reducer
        if (drawBoxState) {
            const clampedPosition = getRelativeMousePosition(mouseMoveEvent, containerRef.current, 20);
            const endPosition = respectMinimumSize(clampedPosition, drawBoxState, 20);
            setDrawBoxState({
                ...drawBoxState,
                endX: endPosition.posX,
                endY: endPosition.posY
            });
        }
    }

    function handleDrawEnd() {
        setDrawBoxState(undefined);
        //TODO create the box
    }

    const actualStyle = {
        ...style,
        cursor: drawBoxState ? "nwse-resize" : "default",
        position: "relative",
        display: "flex",
        alignItems: "center"
    };

    const isEmpty = !drawBoxState;

    return (
        <div ref={ containerRef } style={ actualStyle } onMouseDown={ handleDrawStart } onMouseMove={ handleMouseMove } onMouseUp={ handleDrawEnd }>
            {
                drawBoxState && <DrawBox box={ drawBoxState } />
            }
            {
                isEmpty && <Typography style={ { color: "#aaa", margin: "0 auto", fontSize: "200%" } }>Click and drag anywhere to add a new element to your workspace</Typography>
            }
        </div>
    );
}

export default function WorkspaceEditor({ value, style }) {
    const bigStyle = { ...style, display: "flex", flexDirection: "column" };
    return (
        <div style={ bigStyle }>
            <WorkspaceToolbar />
            <Workspace value={ value } onChange={ value } style={ { flex: "1 1 0", backgroundColor: "#ffffdd" } } />
        </div>
    );
}
