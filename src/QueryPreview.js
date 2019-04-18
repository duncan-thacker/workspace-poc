import React from "react";
import DataGrid from "react-data-grid";
import Map from "pigeon-maps";
import createUuid from "uuid-v4";
import { Typography } from "@material-ui/core";

function emptyRows(count) {
    return new Array(count).fill({});
}

function emptyColumns(count) {
    return new Array(count).fill({});
}

const COLUMN_NAMES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function toNamedColumn(column, index) {
    const columnName = index < COLUMN_NAMES.length ?
        COLUMN_NAMES.charAt(index) :
        COLUMN_NAMES.charAt(Math.floor(index / COLUMN_NAMES.length) - 1) + COLUMN_NAMES.charAt(index % COLUMN_NAMES.length);
    return {
        ...column,
        name: columnName,
        resizable: true,
        width: 100,
        key: column.key || columnName
    };
}

const ROWS = [
    { id: createUuid(), title: "Some Title 1", count: 50 },
    { id: createUuid(), title: "Some Title 2", count: 5 },
    { id: createUuid(), title: "Some Title 3", count: 1 },
    { id: createUuid(), title: "Some Title 4", count: 663 },
    { id: createUuid(), title: "Some Title 5", count: 49 },
    { id: createUuid(), title: "Some Title 6", count: 15 },
    ...emptyRows(50)
];

const getRow = rowIndex => ROWS[rowIndex];

const COLUMNS = [
    { key: "id" },
    { key: "title" },
    { key: "count" },
    ...emptyColumns(10)
].map(toNamedColumn);

const DEFAULT_MAP_CENTER = [50.879, 4.6997];
const DEFAULT_MAP_ZOOM = 12;

export default function QueryPreview({ results, parameters, view, onViewChange, bounds }) {    

    function handleMapViewChange({ center, zoom, initial }) {
        if (!initial) {
            onViewChange({
                center, zoom
            });
        }
    }

    return (
        <Typography component="div">
            { view.type === "spreadsheet" && <DataGrid columns={ COLUMNS } rowGetter={ getRow } rowsCount={ 50 } minHeight={ bounds.height } enableCellSelect cellRangeSelection={{}} /> }
            { view.type === "map" && <Map center={ view.center || DEFAULT_MAP_CENTER } zoom={ view.zoom || DEFAULT_MAP_ZOOM } width={ bounds.width } height={ bounds.height } onBoundsChanged={ handleMapViewChange } /> }
        </Typography>
    );
}