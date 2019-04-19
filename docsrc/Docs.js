import React, { useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography, AppBar, Tabs, Tab, Toolbar, Button } from "@material-ui/core";
import { blue, cyan } from "@material-ui/core/colors";
import { hot } from "react-hot-loader/root";
import WorkspaceEditor from "../src/WorkspaceEditor.js";
import useSharedReducer from "./useSharedReducer";
import createUuid from "uuid-v4";
import workspaceReducer from "./workspaceReducer";

const docsTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: cyan
    },
    typography: {
        useNextVariants: true,
    }
});

function usersReducer(users, action) {
    if (action.type === "USER_SELECT_BOX") {
        return {
            ...users,
            [action.userId]: {
                selectedBoxId: action.selectedBoxId
            }
        };
    }
    throw new Error("Unrecognised action type " + action.type);
}

const initialWorkspaceState = { sections: [{ name: "Section1", id: "section1" }] };

function Docs() {

    const [ workspace, dispatch ] = useSharedReducer("workspaceComms", workspaceReducer, initialWorkspaceState);

    const [ users, dispatchUsers ] = useSharedReducer("userComms", usersReducer, {});

    const [ currentTabIndex, setCurrentTabIndex ] = useState(0);

    function handleAddSection() {
        dispatch({
            type: "ADD_NEW_SECTION",
            id: createUuid(),
            name: "New section"
        });
    }

    const sectionId = workspace.sections[currentTabIndex].id;
    function handleSectionDispatch(action) {
        dispatch({
            ...action,
            sectionId
        });
    }

    return (
        <MuiThemeProvider theme={ docsTheme }>
            <div style={ { display: "flex", flexDirection: "column", height: "100%" } }>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h4" color="inherit">
                            Workspaces
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Tabs value={ currentTabIndex } onChange={ (event, value) => setCurrentTabIndex(value) } style={ { boxShadow: "0px 2px 8px rgba(0,0,0,0.5)" } }>
                    {
                        workspace.sections.map(section => <Tab
                            key={ section.id }
                            label={ section.name }
                        />)
                    }
                    <Button variant="contained" onClick={ handleAddSection }>create</Button>
                </Tabs>
                <WorkspaceEditor value={ workspace.sections[currentTabIndex] } dispatch={ handleSectionDispatch } users={ users } dispatchUsers={ dispatchUsers } style={ { flex: "1 1 0" } } />
            </div>
        </MuiThemeProvider>
    );
}

export default hot(Docs);
