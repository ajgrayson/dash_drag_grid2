const STORAGE_KEY = 'dash_draggable';

export const saveToLs = (key, value) => {
    if (!global.localStorage) { return }
    const storage = JSON.parse(global.localStorage.getItem('dash_draggable'))
    global.localStorage.setItem(
        `dash_draggable`,
        JSON.stringify({
            ...storage,
            [key]: value
        })
    );
}

export const getFromLs = (key) => {
    let ls = {};
    if (!global.localStorage) { return {} }
    try {
        ls = JSON.parse(global.localStorage.getItem(`dash_draggable`)) || {};
    } catch (e) {
        /* Ignore */
    }
    return ls[key];
}


export const saveToLocalStorage = (key, value) => {
    if (!global.localStorage) { return }
    const storage = JSON.parse(global.localStorage.getItem(STORAGE_KEY))
    global.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            ...storage,
            [key]: value
        })
    );
}

export const getFromLocalStorage = (key) => {
    let ls = {};
    if (!global.localStorage) { return {} }
    try {
        ls = JSON.parse(global.localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
        /* Ignore */
    }
    return ls[key];
}

