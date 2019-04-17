import React, { useState } from "react";

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
        border: "3px dashed #000"
    };
    return <div style={ style } />;
}

function Workspace({ style, value, onChange }) {

    const [ drawBoxState, setDrawBoxState ] = useState(undefined);

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
            setDrawBoxState({
                ...drawBoxState,
                endX: mouseMoveEvent.clientX,
                endY: mouseMoveEvent.clientY
            });            
        }
    }

    function handleDrawEnd(drawStopEvent) {        
        setDrawBoxState(undefined);
        //TODO create the box
    }    

    return (
        <div style={ style } onMouseDown={ handleDrawStart } onMouseMove={ handleMouseMove } onMouseUp={ handleDrawEnd }>
            {
                drawBoxState && <DrawBox box={ drawBoxState } />
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
