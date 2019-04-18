const getBoundsBottom = bounds => bounds.top + bounds.height;
const getBoundsRight = bounds => bounds.left + bounds.width;
const getBoundsHorizontalMiddle = bounds => bounds.left + (bounds.width / 2);
const getBoundsVerticalMiddle = bounds => bounds.top + (bounds.height / 2);

export const VERTICAL_RESIZER_BOTTOM = {
    getHandleTop: getBoundsBottom,
    getHandleElementTop: getBoundsBottom,
    getUpdatedTop: bounds => bounds.top,
    getUpdatedHeight: (bounds, newHandlePosition, minimumWidth, minimumHeight) => Math.max(newHandlePosition.top - bounds.top, minimumHeight)
};

export const HORIZONTAL_RESIZER_RIGHT = {
    getHandleLeft: getBoundsRight,
    getHandleElementLeft: getBoundsRight,
    getUpdatedLeft: bounds => bounds.left,
    getUpdatedWidth: (bounds, newHandlePosition, minimumWidth) => Math.max(newHandlePosition.left - bounds.left, minimumWidth)
};

export const VERTICAL_RESIZER_TOP = {
    getHandleTop: bounds => bounds.top,
    getHandleElementTop: (bounds, handleSizeInPixels) => bounds.top - handleSizeInPixels,
    getUpdatedTop: (bounds, newHandlePosition, minimumWidth, minimumHeight) => {
        const boundsBottom = getBoundsBottom(bounds);
        const maximumTop = boundsBottom - minimumHeight;
        return Math.min(newHandlePosition.top, maximumTop);
    },
    getUpdatedHeight: (bounds, newHandlePosition, minimumWidth, minimumHeight) => {
        const boundsBottom = getBoundsBottom(bounds);
        const maximumTop = boundsBottom - minimumHeight;
        const newTop = Math.min(newHandlePosition.top, maximumTop);
        return boundsBottom - newTop;
    }
};

export const HORIZONTAL_RESIZER_LEFT = {
    getHandleLeft: bounds => bounds.left,
    getHandleElementLeft: (bounds, handleSizeInPixels) => bounds.left - handleSizeInPixels,
    getUpdatedLeft: (bounds, newHandlePosition, minimumWidth) => {
        const boundsRight = getBoundsRight(bounds);
        const maximumLeft = boundsRight - minimumWidth;
        return Math.min(newHandlePosition.left, maximumLeft);
    },
    getUpdatedWidth: (bounds, newHandlePosition, minimumWidth) => {
        const boundsRight = getBoundsRight(bounds);
        const maximumLeft = boundsRight - minimumWidth;
        const newTop = Math.min(newHandlePosition.left, maximumLeft);
        return boundsRight - newTop;
    }
};

export const HORIZONTAL_RESIZER_NONE = {
    getHandleLeft: getBoundsHorizontalMiddle,
    getHandleElementLeft: (bounds, handleSizeInPixels) => getBoundsHorizontalMiddle(bounds) - (handleSizeInPixels / 2),
    getUpdatedLeft: bounds => bounds.left,
    getUpdatedWidth: bounds => bounds.width
};

export const VERTICAL_RESIZER_NONE = {
    getHandleTop: getBoundsVerticalMiddle,
    getHandleElementTop: (bounds, handleSizeInPixels) => getBoundsVerticalMiddle(bounds) - (handleSizeInPixels / 2),
    getUpdatedTop: bounds => bounds.top,
    getUpdatedHeight: bounds => bounds.height
};
