const output = document.getElementById("output");
const anchor = document.getElementById("anchor");

// TODO - improve: total/str rendering, banner, separators, clear
function printOut(str) {
    let outLine = document.createElement("p");
    outLine.textContent = str;
    output.insertBefore(outLine, anchor.nextSibling);
}

export { printOut }