import React, { useState } from "react";
import { Toolbar, Button } from "@material-ui/core";

const noop = () => {};

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
        </Toolbar>
    );
}

function ResizeHandles({ box, onResize }) {
    return false;
}

export default function WorkspaceBox({ box, onRemove, onResize, onSelect, isSelected }) {
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
        <div style={ style } onClick={ onSelect }>
            {
                isSelected && <ControlPanel onRemove={ onRemove } />
            }
            {
                isSelected && <ResizeHandles onResize={ onResize } />
            }
        </div>
    );
}
