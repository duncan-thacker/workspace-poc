import React, { useState, useEffect } from "react";
import Map from "pigeon-maps";
import Marker from "pigeon-marker";

function useFirstRender() {
    const [firstRender, setFirstRender] = useState(true);
    useEffect(() => {
        setFirstRender(false);
    }, []);
    return firstRender;
}

export default function DataMap({ rows, width, ...props }) {
    const firstRender = useFirstRender();
    const actualWidth = firstRender ? undefined : width; //workaround weird pigeon issue
    return (
        <Map {...props} width={ actualWidth }>
            {
                rows.map(row => <Marker key={ row.id } anchor={ row.location } />)
            }
        </Map>
    );
}
