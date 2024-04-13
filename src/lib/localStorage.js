const STORAGE_KEY = 'dash_draggable';

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
    console.log('getFromLocalStorage')
    let ls = {};
    if (!global.localStorage) { return {} }
    try {
        ls = JSON.parse(global.localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
        /* Ignore */
    }
    return ls[key];
}

