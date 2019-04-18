const getBoxBottom = box => box.top + box.height;
const getBoxRight = box => box.left + box.width;
const getBoxHorizontalMiddle = box => box.left + (box.width / 2);
const getBoxVerticalMiddle = box => box.top + (box.height / 2);

export const VERTICAL_RESIZER_BOTTOM = {
    getHandleTop: getBoxBottom,
    getHandleElementTop: getBoxBottom,
    getUpdatedTop: box => box.top,
    getUpdatedHeight: (box, newHandlePosition, minimumSize) => Math.max(newHandlePosition.top - box.top, minimumSize)
};

export const HORIZONTAL_RESIZER_RIGHT = {
    getHandleLeft: getBoxRight,
    getHandleElementLeft: getBoxRight,
    getUpdatedLeft: box => box.left,
    getUpdatedWidth: (box, newHandlePosition, minimumSize) => Math.max(newHandlePosition.left - box.left, minimumSize)
};

export const VERTICAL_RESIZER_TOP = {
    getHandleTop: box => box.top,
    getHandleElementTop: (box, handleSizeInPixels) => box.top - handleSizeInPixels,
    getUpdatedTop: (box, newHandlePosition, minimumSize) => {
        const boxBottom = getBoxBottom(box);
        const maximumTop = boxBottom - minimumSize;
        return Math.min(newHandlePosition.top, maximumTop);
    },
    getUpdatedHeight: (box, newHandlePosition, minimumSize) => {
        const boxBottom = getBoxBottom(box);
        const maximumTop = boxBottom - minimumSize;
        const newTop = Math.min(newHandlePosition.top, maximumTop);
        return boxBottom - newTop;
    }
};

export const HORIZONTAL_RESIZER_LEFT = {
    getHandleLeft: box => box.left,
    getHandleElementLeft: (box, handleSizeInPixels) => box.left - handleSizeInPixels,
    getUpdatedLeft: (box, newHandlePosition, minimumSize) => {
        const boxRight = getBoxRight(box);
        const maximumLeft = boxRight - minimumSize;
        return Math.min(newHandlePosition.left, maximumLeft);
    },
    getUpdatedWidth: (box, newHandlePosition, minimumSize) => {
        const boxRight = getBoxRight(box);
        const maximumLeft = boxRight - minimumSize;
        const newTop = Math.min(newHandlePosition.left, maximumLeft);
        return boxRight - newTop;
    }
};

export const HORIZONTAL_RESIZER_NONE = {
    getHandleLeft: getBoxHorizontalMiddle,
    getHandleElementLeft: (box, handleSizeInPixels) => getBoxHorizontalMiddle(box) - (handleSizeInPixels / 2),
    getUpdatedLeft: box => box.left,
    getUpdatedWidth: box => box.width
};

export const VERTICAL_RESIZER_NONE = {
    getHandleTop: getBoxVerticalMiddle,
    getHandleElementTop: (box, handleSizeInPixels) => getBoxVerticalMiddle(box) - (handleSizeInPixels / 2),
    getUpdatedTop: box => box.top,
    getUpdatedHeight: box => box.height
};
