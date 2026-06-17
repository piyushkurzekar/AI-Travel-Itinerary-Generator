const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { processDocuments } = require("../services/document.service");
const { extractBookingDetails } = require("../services/ai.service");
const { deleteLocalFile } = require("../services/storage.service");

const extractBookings = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  // Process all uploaded documents (extract text + upload to Cloudinary)
  const processedDocs = await processDocuments(req.files);

  const successfulDocs = processedDocs.filter((d) => d.success);
  if (successfulDocs.length === 0) {
    throw new ApiError(
      422,
      "Could not extract text from any of the uploaded documents"
    );
  }

  // Combine all extracted texts
  const combinedText = successfulDocs
    .map((d) => `--- Document: ${d.fileName} ---\n${d.extractedText}`)
    .join("\n\n");

  // Send to Gemini for structured extraction
  let bookingDetails;
  try {
    bookingDetails = await extractBookingDetails(combinedText);
  } catch (error) {
    throw new ApiError(
      502,
      `AI extraction failed: ${error.message}. Please review and fill details manually.`
    );
  }

  const documents = successfulDocs.map((d) => ({
    fileName: d.fileName,
    fileType: d.fileType,
    fileUrl: d.fileUrl,
    publicId: d.publicId,
  }));

  res.json(
    new ApiResponse(200, "Documents processed successfully", {
      bookingDetails,
      documents,
      failedDocs: processedDocs
        .filter((d) => !d.success)
        .map((d) => ({ name: d.fileName, error: d.error })),
    })
  );
});

module.exports = { extractBookings };
