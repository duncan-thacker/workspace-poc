import { useEffect, useReducer } from "react";

const channels = {};

function createBroadcastChannel(channelName) {
    const broadcastChannel = new BroadcastChannel(channelName);
    const channel = {
        subscribers: [],
        postMessage: message => broadcastChannel.postMessage(message)
    };
    broadcastChannel.onMessage = messageEvent => {
        channel.subscribers.forEach(subscriber => {
            subscriber(messageEvent.data);
        });
    };
    return channel;
}

//from https://stackoverflow.com/a/28230846/5009210
function createStorageChannel(channelName) {
    const channel= {
        subscribers: [],
        postMessage(message) {
            window.localStorage.setItem(channelName, JSON.stringify(message));
            window.localStorage.removeItem(channelName);
        }
    };

    function onStorage(storageEvent) {
        if (storageEvent.key === channelName) {
            const message = JSON.parse(storageEvent.newValue);
            if (message) {
                channel.subscribers.forEach(subscriber => {
                    subscriber(message);
                });
            }
        }
    }

    window.addEventListener("storage", onStorage);

    return channel;
}

function getChannel(channelName) {
    if (!channels[channelName]) {
        channels[channelName] = createStorageChannel(channelName);
    }
    return channels[channelName];
}

function subscribeToMessages(channelName, callback) {
    const channel = getChannel(channelName);
    channel.subscribers.push(callback);
    return () => {
        const index = channel.subscribers.findIndex(subscriber => subscriber === callback);
        channel.subscribers.splice(index, 1);
    };
}

export default function useSharedReducer(channelName, reducer, initialState) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const sharedDispatch = action => {
        dispatch(action);
        getChannel(channelName).postMessage(action);
    };

    useEffect(() => subscribeToMessages(channelName, dispatch), []);

    return [state, sharedDispatch];
}
