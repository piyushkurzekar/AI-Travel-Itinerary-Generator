const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadToCloudinary = async (filePath, originalName, fileType) => {
  try {
    const resourceType = fileType === "application/pdf" ? "raw" : "image";
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "travel-itinerary/documents",
      resource_type: resourceType,
      public_id: `doc_${Date.now()}_${originalName.replace(/\s/g, "_")}`,
      use_filename: false,
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw new Error(`Failed to upload file to storage: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId, fileType) => {
  try {
    const resourceType = fileType === "application/pdf" ? "raw" : "image";
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

const deleteLocalFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Local file deletion error:", error.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary, deleteLocalFile };
