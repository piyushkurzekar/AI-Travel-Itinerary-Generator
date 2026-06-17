import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image } from "lucide-react";

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const FileDropzone = ({ onDrop, disabled = false }) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
        isDragActive && !isDragReject
          ? "border-blue-500 bg-blue-50"
          : isDragReject
          ? "border-red-400 bg-red-50"
          : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`p-4 rounded-full ${isDragActive ? "bg-blue-100" : "bg-white shadow"}`}>
          <Upload className={isDragActive ? "text-blue-600" : "text-gray-400"} size={28} />
        </div>
        {isDragActive && !isDragReject ? (
          <p className="text-blue-600 font-medium">Drop your files here!</p>
        ) : isDragReject ? (
          <p className="text-red-500 font-medium">Unsupported file type!</p>
        ) : (
          <>
            <div>
              <p className="font-semibold text-gray-700">
                Drag & drop files here, or{" "}
                <span className="text-blue-600 underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports PDF, JPG, JPEG, PNG • Max 10MB per file • Up to 5 files
              </p>
            </div>
          </>
        )}
        <div className="flex gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <FileText size={13} /> PDF
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Image size={13} /> JPG/PNG
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileDropzone;
