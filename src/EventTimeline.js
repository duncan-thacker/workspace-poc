import React from "react";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { Typography } from "@material-ui/core";

export default function EventTimeline({ timeline }) {
    return (
        <div style={ { height: "100%", overflowY: "auto" } }>
            <Timeline>
                {
                    timeline.map(event =>
                        <TimelineEvent
                            key={ event.when.format() }
                            title={ <Typography variant="title">{ event.what }</Typography> }
                            createdAt={ <Typography variant="subtitle1" color="textSecondary">{ event.when.fromNow() }</Typography> }
                            icon={ <event.Icon /> } />
                    )
                }
            </Timeline>
        </div>
    );
}
