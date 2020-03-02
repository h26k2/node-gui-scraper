
const xpathToIndex = (xpath) => {

    let index = [];
    let elems = val.split("/");

    Array.from(elems).forEach((elem)=>{
        let s = elem.indexOf(`[`) + 1;
        let e = elem.length - 1;
        index.push(parseInt(elem.substr(s,e)));
    });

    return xpathToIndex;

}

module.exports = xpathToIndex;