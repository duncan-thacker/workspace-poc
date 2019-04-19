import React, { useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography, AppBar, Tabs, Tab, Toolbar, Button } from "@material-ui/core";
import { blue, cyan } from "@material-ui/core/colors";
import { hot } from "react-hot-loader/root";
import WorkspaceEditor from "../src/WorkspaceEditor.js";
import createUuid from "uuid-v4";

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
    const [ workspace, setWorkspace ] = useState({
        sections: [{ name: "Section1", id: createUuid() }]
    });

    const [ currentTabIndex, setCurrentTabIndex ] = useState(0);

    function handleUpdateSection(updatedSection) {
        const newSections = workspace.sections.map(section => {
            return section.id === updatedSection.id ? updatedSection : section;
        });
        setWorkspace({
            sections: newSections
        });
    }

    function handleAddSection() {
        const newSections = [...workspace.sections, { name: "Section" + (workspace.sections.length + 1), id: createUuid() }];
        setWorkspace({
            sections: newSections
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
                <WorkspaceEditor value={ workspace.sections[currentTabIndex] } onChange={ handleUpdateSection } style={ { flex: "1 1 0" } } />
            </div>
        </MuiThemeProvider>
    );
}

export default hot(Docs);
