const { createWorker } = require("tesseract.js");

const extractTextFromImage = async (filePath) => {
  let worker;
  try {
    worker = await createWorker("eng", 1, {
      logger: () => {}, // suppress verbose logs
    });
    const { data } = await worker.recognize(filePath);
    return data.text || "";
  } catch (error) {
    console.error("OCR extraction error:", error.message);
    throw new Error(`Failed to extract text from image: ${error.message}`);
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
};

module.exports = { extractTextFromImage };
