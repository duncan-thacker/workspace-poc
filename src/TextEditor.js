import React, { useRef } from "react";
import { Editor } from "draft-js";
import "draft-js/dist/Draft.css";
import { Typography } from "@material-ui/core";

export default function TextEditor({ value, onChange }) {
    const editorRef = useRef(undefined);

    function handleChange(updatedText) {
        const newHeight = editorRef.current.editor.firstElementChild.offsetHeight;
        onChange(updatedText, newHeight);
    }

    return (
        <Typography component="div" style={ { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } }>
            <Editor ref={ editorRef } editorState={ value } onChange={ handleChange } />
        </Typography>
    );
}
