import React from "react";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { Typography } from "@material-ui/core";

import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import DiningIcon from "@material-ui/icons/LocalDining";
import GasStationIcon from "@material-ui/icons/LocalGasStation";
import BedIcon from "@material-ui/icons/LocalHotel";

import moment from "moment";

const ICONS = {
    song: MusicNoteIcon,
    photo: PhotoCameraIcon,
    food: DiningIcon,
    petrol: GasStationIcon,
    sleep: BedIcon
};

export default function EventTimeline({ timeline }) {
    return (
        <div style={ { height: "100%", overflowY: "auto" } }>
            <Timeline>
                {
                    timeline.map(event => {
                        const Icon = ICONS[event.icon];
                        return <TimelineEvent
                            key={ event.when }
                            title={ <Typography variant="subtitle1">{ event.what }</Typography> }
                            createdAt={ <Typography variant="subtitle1" color="textSecondary">{ moment().subtract(event.when, "minutes").fromNow() }</Typography> }
                            icon={ <Icon /> }
                        />;
                    })
                }
            </Timeline>
        </div>
    );
}
