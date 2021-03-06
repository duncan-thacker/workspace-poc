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

const USER_ID = createUuid();

function Workspace({ style, value, dispatch, users, dispatchUsers }) {

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

    function handleSelectBox(boxId) {
        dispatchUsers({
            type: "USER_SELECT_BOX",
            userId: USER_ID,
            selectedBoxId: boxId
        });
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
                setTimeout(
                    () => handleSelectBox(newBox.id),
                    100
                ); //TODO fix - this is a hack to get around the deselection caused by the following click
                dispatch({
                    type: "ADD_BOX",
                    boxToAdd: newBox
                });
            }
            setDrawBoxState(undefined);
        }
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
            handleSelectBox(undefined);
        }
    }

    const currentUserSelectedBoxId = users[USER_ID] && users[USER_ID].selectedBoxId;

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
                        onSelect={ () => handleSelectBox(box.id) }
                        dispatch={ dispatch }
                        isSelected={ currentUserSelectedBoxId === box.id }
                        otherSelectors={ Object.keys(users).filter(userId => userId !== USER_ID && users[userId].selectedBoxId === box.id) }
                        containerElement={ containerRef.current }
                    />
                )
            }
        </div>
    );
}

export default function WorkspaceEditor({ value, dispatch, style, users, dispatchUsers }) {
    const bigStyle = { ...style, display: "flex", flexDirection: "column" };
    return (
        <div style={ bigStyle }>
            <Workspace
                value={ value }
                dispatch={ dispatch }
                users={ users }
                dispatchUsers={ dispatchUsers }
                style={ { flex: "1 1 0" } }
            />
        </div>
    );
}
