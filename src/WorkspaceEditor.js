import React, { useState, useRef } from "react";
import { Typography } from "@material-ui/core";
import createUuid from "uuid-v4";

const preventDefault = event => event.preventDefault();
const isEventLocal = event => event.target === event.currentTarget;

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

function WorkspaceBox({ box }) {
    //TODO fix box overflow by clipping
    const { top, left, width, height } = box;
    const style = {
        top,
        left,
        width,
        height,
        position: "absolute",
        backgroundColor: "#ccc",
        borderRadius: "2px",
        boxSizing: "border-box"
    };
    return <div style={ style } />;
}

function Workspace({ style, value, onChange }) {

    const [ drawBoxState, setDrawBoxState ] = useState(undefined);
    const containerRef = useRef(null);

    function handleDrawStart(drawStartEvent) {
        if (isEventLocal(drawStartEvent)) {
            setDrawBoxState({
                startX: drawStartEvent.clientX,
                startY: drawStartEvent.clientY,
                endX: drawStartEvent.clientX,
                endY: drawStartEvent.clientY,
            });
        }
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
        const { startX, startY, endX, endY } = drawBoxState;
        const newBox = {
            id: createUuid(),
            left: Math.min(startX, endX),
            top: Math.min(startY, endY),
            width: Math.abs(startX - endX),
            height: Math.abs(startY - endY)
        };
        //TODO this feels like a reducer job
        const oldBoxes = value.boxes || [];
        const newValue = {
            ...value,
            boxes: [...oldBoxes, newBox ]
        };
        setDrawBoxState(undefined);
        onChange(newValue);
    }

    const actualStyle = {
        ...style,
        cursor: drawBoxState ? "nwse-resize" : "default",
        position: "relative",
        display: "flex",
        alignItems: "center"
    };

    const { boxes = [] } = value;
    const isEmpty = !drawBoxState && boxes.length === 0;

    return (
        <div onDragStart={ preventDefault } ref={ containerRef } style={ actualStyle } onMouseDown={ handleDrawStart } onMouseMove={ handleMouseMove } onMouseUp={ handleDrawEnd }>
            {
                drawBoxState && <DrawBox box={ drawBoxState } />
            }
            {
                isEmpty && <Typography style={ { color: "#aaa", margin: "0 auto", fontSize: "200%" } }>Click and drag anywhere to add a new element to your workspace</Typography>
            }
            {
                boxes.map(box => <WorkspaceBox box={ box } key={ box.id } />)
            }
        </div>
    );
}

export default function WorkspaceEditor({ value, onChange, style }) {
    const bigStyle = { ...style, display: "flex", flexDirection: "column" };
    return (
        <div style={ bigStyle }>
            <WorkspaceToolbar />
            <Workspace value={ value } onChange={ onChange } style={ { flex: "1 1 0" } } />
        </div>
    );
}
