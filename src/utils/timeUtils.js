function ceilTimestamp(ts, interval){
    let k = Math.floor(ts / interval);
    const modulo = ts % interval;
    if (modulo > 0) {
        k += 1;
    }
    return k * interval
}

function floorTimestamp(ts, interval){
    const k = Math.floor(ts / interval);
    return k * interval;
}


function createGrid(startRts, endRts, tResample) {
    if (endRts < startRts)
        return;

    if ((endRts - startRts) % tResample !== 0){
        return;
    }
    const grid = [startRts];
    let t = startRts;
    while (t < endRts) {
        t += tResample;
        grid.push(t);
    }
    return grid;
}

export {ceilTimestamp, floorTimestamp, createGrid};