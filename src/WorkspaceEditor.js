import React, { useState, useRef } from "react";
import { Typography } from "@material-ui/core";
import WorkspaceBox from "./WorkspaceBox";
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

function replaceBox(boxes = [], newBox) {
    return boxes.map(box => {
        return box.id === newBox.id ? newBox : box;
    });
}

function Workspace({ style, value, onChange, selectedBoxId, onSelectBox }) {

    const [ drawBoxState, setDrawBoxState ] = useState(undefined);
    const containerRef = useRef(null);

    function handleDrawStart(drawStartEvent) {
        if (isEventLocal(drawStartEvent)) {
            setDrawBoxState({
                startX: drawStartEvent.clientX,
                startY: drawStartEvent.clientY,
                endX: drawStartEvent.clientX,
                endY: drawStartEvent.clientY
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
        if (drawBoxState) {
            const { startX, startY, endX, endY } = drawBoxState;
            const newBox = {
                id: createUuid(),
                bounds: {
                    left: Math.min(startX, endX),
                    top: Math.min(startY, endY),
                    width: Math.abs(startX - endX),
                    height: Math.abs(startY - endY)
                }
            };
            if (newBox.bounds.width > 50 && newBox.bounds.height > 50 ) {
                //TODO this feels like a reducer job
                const oldBoxes = value.boxes || [];
                const newValue = {
                    ...value,
                    boxes: [...oldBoxes, newBox ]
                };
                setTimeout(
                    () => onSelectBox(newBox.id),
                    100
                ); //TODO fix - this is a hack to get around the deselection caused by the following click
                onChange(newValue);
            }
            setDrawBoxState(undefined);
        }
    }

    function handleRemoveBox(boxToRemove) {
        const oldBoxes = value.boxes || [];
        onChange({
            ...value,
            boxes: oldBoxes.filter(box => box.id !== boxToRemove.id)
        });
    }

    function handleUpdateBox(updatedBox) {
        onChange({
            ...value,
            boxes: replaceBox(value.boxes, updatedBox)
        });
    }

    const actualStyle = {
        ...style,
        cursor: drawBoxState ? "nwse-resize" : "default",
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
    };

    const { boxes = [] } = value;
    const isEmpty = boxes.length === 0;

    function handleBackgroundClick(clickEvent) {
        if (isEventLocal(clickEvent)) {
            onSelectBox(undefined);
        }
    }

    return (
        <div className='workspace-editor' onDragStart={ preventDefault } ref={ containerRef } style={ actualStyle } onMouseDown={ handleDrawStart } onMouseMove={ handleMouseMove } onMouseUp={ handleDrawEnd } onClick={ handleBackgroundClick }>
            {
                drawBoxState && <DrawBox box={ drawBoxState } />
            }
            {
                isEmpty && <Typography style={ { color: "#aaa", margin: "0 auto", fontSize: "200%", pointerEvents: "none" } }>Click and drag anywhere to add a new element to your workspace</Typography>
            }
            {
                boxes.map(box =>
                    <WorkspaceBox
                        box={ box }
                        key={ box.id }
                        onRemove={ () => handleRemoveBox(box) }
                        onSelect={ () => onSelectBox(box.id) }
                        onChange={ updatedBox => handleUpdateBox(updatedBox) }
                        isSelected={ selectedBoxId === box.id }
                        containerElement={ containerRef.current }
                    />
                )
            }
        </div>
    );
}

export default function WorkspaceEditor({ value, onChange, style, }) {
    const bigStyle = { ...style, display: "flex", flexDirection: "column" };
    const [ selectedBoxId, setSelectedBoxId ] = useState(undefined);
    return (
        <div style={ bigStyle }>
            <WorkspaceToolbar />
            <Workspace
                value={ value }
                onChange={ onChange }
                onSelectBox={ setSelectedBoxId }
                style={ { flex: "1 1 0" } }
                selectedBoxId={ selectedBoxId }
            />
        </div>
    );
}
