import React from "react";
import { Card, CardContent, CardMedia, CardActions, Button, Typography } from "@material-ui/core";
import DataMap from "./DataMap";

export default function PersonCard({ card }) {
    return (
        <Card style={ { height: "100%", display: "flex", flexDirection: "column" } }>
            {
                card.view.type === "image" && <CardMedia image={ card.image } title={ `Picture of ${card.title}` } style={ { height: 120 } } />
            }
            {
                card.view.type === "map" && <DataMap rows={ [card] } center={ card.location } zoom={ 11 } height={ 120 } />
            }
            <CardContent>
                <Typography variant="h5" gutterBottom>{ card.title }</Typography>
                <Typography color="textSecondary" gutterBottom>{ card.bioSummary }</Typography>
                <Typography>{ card.description }</Typography>
            </CardContent>
            <CardActions style={ { marginTop: "auto" } }>
                <Button color="primary" style={ { marginLeft: "auto" } } size="small" href="https://www.google.com">More...</Button>
            </CardActions>
        </Card>
    );
}
