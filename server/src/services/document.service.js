const path = require("path");
const { extractTextFromPDF } = require("./pdf.service");
const { extractTextFromImage } = require("./ocr.service");
const { uploadToCloudinary, deleteLocalFile } = require("./storage.service");

const extractTextFromFile = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;

  if (ext === ".pdf" || file.mimetype === "application/pdf") {
    return extractTextFromPDF(filePath);
  }

  if ([".jpg", ".jpeg", ".png"].includes(ext)) {
    return extractTextFromImage(filePath);
  }

  throw new Error(`Unsupported file type: ${ext}`);
};

const processDocuments = async (files) => {
  const results = [];

  for (const file of files) {
    let cloudinaryResult = null;
    let extractedText = "";

    try {
      // Extract text first
      extractedText = await extractTextFromFile(file);

      // Upload to Cloudinary
      try {
        cloudinaryResult = await uploadToCloudinary(
          file.path,
          file.originalname,
          file.mimetype
        );
      } catch (uploadError) {
        console.error("Cloudinary upload failed, continuing:", uploadError.message);
      }

      results.push({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileUrl: cloudinaryResult?.url || "",
        publicId: cloudinaryResult?.publicId || "",
        extractedText,
        success: true,
      });
    } catch (error) {
      results.push({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileUrl: "",
        publicId: "",
        extractedText: "",
        success: false,
        error: error.message,
      });
    } finally {
      // Always clean up local temp file
      deleteLocalFile(file.path);
    }
  }

  return results;
};

module.exports = { processDocuments, extractTextFromFile };
