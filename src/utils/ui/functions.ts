// export const formatText = (str: string) => {
//     let s = str?.trim() || ''
//     if (s) {
//         return s.split(" ").map((e, i) => e && i === 0 ? `${e.slice(0, 1).toUpperCase()}${e.slice(1)}` : e.toLowerCase()).join(" ");
//     }
//     return s;
// }

export const formatText = (str: string) => {
    let s = str?.trim() || ''
    if (s) {
        return s.split(" ").map((e, i) => e && e).join(" ");
    }
    return s;
}