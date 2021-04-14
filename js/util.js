/* return Int between min(included) and max(excluded) */
function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/* compare two points, return true if same */
function comparePoints(a, b) {
    return (a[0] == b[0] && a[1] == b[1]);
}

/* Check if a point is in a point list, returns index or -1*/
function findPointInList(point, pointList) {
    for (let i = 0; i < pointList.length; i++) {
        if (comparePoints(point, pointList[i])) {
            return i;
        }
    }

    return -1;
}
