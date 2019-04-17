import React, { useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography, AppBar, Button, Toolbar } from "@material-ui/core";
import { blue, cyan } from "@material-ui/core/colors";
import { hot } from "react-hot-loader/root";
import WorkspaceEditor from "../src/WorkspaceEditor.js"

const docsTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: cyan
    },
    typography: {
        useNextVariants: true,
    }
});

function Docs() {
    const { workspace, setWorkspace } = useState({});
    return (
        <MuiThemeProvider theme={ docsTheme }>
            <div style={ { display: "flex", flexDirection: "column", height: "100%" } }>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h3" color="inherit">
                        Workspaces
                        </Typography>
                        <Button variant="contained" color="secondary">Create New</Button>
                        <Typography color="inherit" style={ { marginLeft: "auto" } }>
                        Current context: PYRODOG investigation <Button color="inherit">V</Button>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <WorkspaceEditor value={ workspace } onChange={ setWorkspace } style={ { flex: "1 1 0" } } />
            </div>
        </MuiThemeProvider>
    );
}

export default hot(Docs);
