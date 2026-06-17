import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Wand2, CheckCircle } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import FileDropzone from "../components/upload/FileDropzone";
import UploadedFileCard from "../components/upload/UploadedFileCard";
import UploadProgress from "../components/upload/UploadProgress";
import Button from "../components/common/Button";
import { extractBookings } from "../api/upload.api";
import toast from "react-hot-toast";

const UploadBooking = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (accepted, rejected) => {
      rejected.forEach((r) => {
        const msg =
          r.errors[0]?.code === "file-too-large"
            ? `${r.file.name} is too large (max 10MB)`
            : `${r.file.name}: ${r.errors[0]?.message}`;
        toast.error(msg);
      });
      const newFiles = [...files, ...accepted].slice(0, 5);
      setFiles(newFiles);
    },
    [files]
  );

  const removeFile = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  };

  const handleExtract = async () => {
    if (!files.length) return toast.error("Please select at least one file");
    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("documents", f));
      const res = await extractBookings(formData, (e) => {
        setProgress(Math.round((e.loaded / e.total) * 80));
      });
      setProgress(100);
      const { bookingDetails, documents, failedDocs } = res.data.data;

      if (failedDocs?.length > 0) {
        failedDocs.forEach((d) => toast.error(`Failed to extract from ${d.name}`));
      }

      toast.success("Booking details extracted successfully!");
      navigate("/review", {
        state: { bookingDetails, documents },
      });
    } catch (err) {
      toast.error(err.message || "Extraction failed. Please try again.");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Upload Travel Documents</h1>
          <p className="text-gray-500 mt-1">
            Upload your booking documents and our AI will extract all the details
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {["Upload Documents", "Review Details", "Generate Itinerary"].map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  i === 0 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step}
              </span>
              {i < 2 && (
                <div className="flex-1 h-px bg-gray-200 mx-1 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="card space-y-5">
          <FileDropzone onDrop={onDrop} disabled={uploading} />

          {files.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected files ({files.length}/5)
              </p>
              <div className="space-y-2">
                {files.map((file, i) => (
                  <UploadedFileCard
                    key={i}
                    file={file}
                    onRemove={removeFile}
                    uploading={uploading}
                  />
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <UploadProgress
              progress={progress}
              label={
                progress < 80
                  ? "Uploading & extracting text..."
                  : "AI processing booking details..."
              }
            />
          )}

          <div className="bg-amber-50 rounded-xl p-3 flex gap-2">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              For best results, ensure documents are clear and legible. PDF
              bookings work best. Image-based documents may require higher
              quality photos.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setFiles([])}
              disabled={uploading || !files.length}
            >
              Clear All
            </Button>
            <Button
              className="flex-1"
              onClick={handleExtract}
              loading={uploading}
              disabled={!files.length}
            >
              <Wand2 size={15} />
              Extract Details
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Supported: PDF, JPG, JPEG, PNG • Max 10MB per file • Up to 5 files
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadBooking;
