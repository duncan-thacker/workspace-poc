import React from "react";
import { Toolbar, Button, Tabs, Tab } from "@material-ui/core";
import { RichUtils } from "draft-js";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import CloseIcon from "@material-ui/icons/Close";
import GridOnIcon from "@material-ui/icons/GridOn";
import PlaceIcon from "@material-ui/icons/Place";
import BarChartIcon from "@material-ui/icons/BarChart";
import ImageIcon from "@material-ui/icons/Image";

const CONTROL_PANEL_STYLE = {
    position: "absolute",
    right: 0,
    top: 0,
    transform: "translateY(-100%)",
    backgroundColor: "#adf",
    borderRadius: "2px",
    padding: 2
};

function isTextHighlighted(textState) {
    const selected = textState.getSelection();
    return selected.getStartOffset() !== selected.getEndOffset();
}

const MINI_TAB_STYLE ={
    minWidth: 80
};

export default function ControlPanel({ onRemove, box, onChangeText, onChangeView }) {

    const { text } = box;
    function handleBoldClick() {
        onChangeText(RichUtils.toggleInlineStyle(text, "BOLD"));
    }

    return (
        <Toolbar style={ CONTROL_PANEL_STYLE }>
            {
                box.type === "text" && <Button disabled={ !isTextHighlighted(text) } onClick={ handleBoldClick }>Bold</Button>
            }
            {
                box.type === "query" && (
                    <Tabs value={ box.query.view.type } onChange={ (event, value) => onChangeView({ type: value })} indicatorColor="primary" textColor="primary">
                        <Tab style={ MINI_TAB_STYLE } value="spreadsheet" label={ <GridOnIcon /> } />
                        <Tab style={ MINI_TAB_STYLE } value="summary" label={ <BarChartIcon /> } />
                        <Tab style={ MINI_TAB_STYLE } value="map" label={ <PlaceIcon /> } />
                    </Tabs>
                )
            }
            {
                box.type === "card" && (
                    <Tabs value={ box.card.view } onChange={ (event, value) => onChangeView({ type: value })} indicatorColor="primary" textColor="primary">
                        <Tab style={ MINI_TAB_STYLE } value="image" label={ <ImageIcon /> } />
                        <Tab style={ MINI_TAB_STYLE } value="map" label={ <PlaceIcon /> } />
                    </Tabs>
                )
            }
            <Button className='drag-handle' style={ { cursor: "move", userSelect: "none" } }><DragHandleIcon /></Button>
            <Button style={ { userSelect: "none" } } onClick={ onRemove }><CloseIcon /></Button>
        </Toolbar>
    );
}
