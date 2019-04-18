import React, { useState, useEffect } from "react";
import DataGrid from "react-data-grid";
import Map from "pigeon-maps";
import Marker from "pigeon-marker";
import createUuid from "uuid-v4";
import { Typography, TextField, MenuItem } from "@material-ui/core";

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

function randomFrom(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function randomFloatBetween(low, high) {
    const difference = high-low;
    return (Math.random() * difference) + low;
}

const SOME_BANDS = ["Nirvana", "Prodigy", "The Killers", "Black-eyed Peas", "Dire Straits", "The Kinks", "The Who", "Coldplay", "London Beat"];
const SOME_COLORS = ["blue", "brown", "red", "green", "orange", "purple", "cyan", "yellow", "mustard", "pink", "scarlet", "vermillion", "puce", "black", "white", "duckegg"];

function createRandomRow() {
    return {
        id: createUuid(),
        color: randomFrom(SOME_COLORS),
        location: [randomFloatBetween(51.2, 51.8), randomFloatBetween(-0.8, 0.8)],
        favBand: randomFrom(SOME_BANDS)
    };
}

const ROWS = new Array(88).fill(0).map(createRandomRow);

const getRow = rowIndex => ROWS[rowIndex];

const COLUMNS = [
    { key: "color" },
    { key: "favBand" },
    ...emptyColumns(10)
].map(toNamedColumn);

const DEFAULT_MAP_CENTER = [51.479, 0];
const DEFAULT_MAP_ZOOM = 9;

function SummaryBar({ value, count, maxCount }) {
    const [ animate, setAnimate ] = useState(false);
    useEffect(() => {
        setAnimate(true);
    }, []);
    const barWidthPercentage = animate ? `${(count * 100 )/maxCount}%` : "0%";
    return (
        <div style={ { display: "flex", padding: "4px 0px", alignItems: "center" } }>
            <Typography style={ { flex: "0 0 150px", textAlign: "right" } }>{ value }</Typography>
            <div style={ { flex: "1 1 0", padding: "0px 8px"}}>
                <Typography className="grow-bar" component="div" style={ { height: "100%", width: barWidthPercentage, backgroundColor: "#c0e4ff", padding: 4 } }>
                    { count }
                </Typography>
            </div>
        </div>
    );
}

function summariseByField(fieldToSummarise) {
    return function accumulateField(runningTotal, row) {
        const value = row[fieldToSummarise];
        const existingSummary = runningTotal.find(summary => summary.value === value);
        if (existingSummary) {
            existingSummary.count++;
            return runningTotal;
        }
        return [...runningTotal, { value, count: 1 }];
    };
}

function byCount(summary1, summary2) {
    return summary2.count - summary1.count;
}


function Summary({ rows, field = "color", onSummaryFieldChange, numberOfBars = 11 }) {
    const summaries = rows.reduce(summariseByField(field), []).sort(byCount).slice(0, numberOfBars);
    const maxCount = summaries[0].count;
    return (
        <div style={ { padding: "20px 30px", height: "100%", overflowY: "auto" }}>
            <div style={ { width: "250px" } }>
                <TextField fullWidth label="Summary field" select value={ field } onChange={ changeEvent => onSummaryFieldChange(changeEvent.target.value) }>
                    <MenuItem value="color">Color</MenuItem>
                    <MenuItem value="favBand">Favourite Band</MenuItem>
                </TextField>
            </div>
            {
                summaries.map(fieldSummary => <SummaryBar key={ fieldSummary.value } { ...fieldSummary } maxCount={ maxCount } />)
            }
        </div>
    );
}

function DataMap({ rows, ...props }) {
    return (
        <Map {...props}>
            {
                rows.map(row => <Marker key={ row.id } anchor={ row.location } />)
            }
        </Map>
    );
}

export default function QueryPreview({ view, onChangeView, bounds }) {

    function handleMapViewChange({ center, zoom, initial }) {
        if (!initial) {
            onChangeView({
                center, zoom
            });
        }
    }

    function handleSummaryViewChange(newSummaryField) {
        onChangeView({
            field: newSummaryField
        });
    }

    return (
        <Typography component="div">
            { view.type === "spreadsheet" && <DataGrid columns={ COLUMNS } rowGetter={ getRow } rowsCount={ 50 } minHeight={ bounds.height } enableCellSelect cellRangeSelection={{}} /> }
            { view.type === "map" && <DataMap rows={ ROWS } center={ view.center || DEFAULT_MAP_CENTER } zoom={ view.zoom || DEFAULT_MAP_ZOOM } height={ bounds.height } onBoundsChanged={ handleMapViewChange } /> }
            { view.type === "summary" && <Summary rows={ ROWS } field={ view.field } onSummaryFieldChange={ handleSummaryViewChange } /> }
        </Typography>
    );
}
