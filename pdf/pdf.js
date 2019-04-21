var toPdf = require("office-to-pdf");
var fs = require("fs");

var Delay_Print = async function(ms) {
    var wordBuffer = await fs.readFileSync("./add.docx");
    var pdfBuffer = await toPdf(wordBuffer);
    fs.writeFileSync("./add.pdf", pdfBuffer)
};
