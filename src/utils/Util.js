export const rowArrayToObject = (row) => {
    let obj = {};
    row.map((d, idx) => {
        obj[d.key] = d.value;
    });
    return obj;
};
