export let setAll = (obj, val) => Object.keys(obj).forEach(k => obj[k] = val);
export let setAllUndefined = obj => setAll(obj, undefined);