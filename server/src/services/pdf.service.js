const fs = require("fs");
const path = require("path");

const extractTextFromPDF = async (filePath) => {
  try {
    const pdfParse = require("pdf-parse");
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

module.exports = { extractTextFromPDF };
