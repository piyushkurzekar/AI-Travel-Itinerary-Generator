import { FileText, Image, X, CheckCircle } from "lucide-react";

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const UploadedFileCard = ({ file, onRemove, uploading }) => {
  const isPdf = file.type === "application/pdf";
  const Icon = isPdf ? FileText : Image;

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
      <div
        className={`p-2 rounded-lg flex-shrink-0 ${
          isPdf ? "bg-red-50" : "bg-blue-50"
        }`}
      >
        <Icon
          size={20}
          className={isPdf ? "text-red-500" : "text-blue-500"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
        <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
      </div>
      {uploading ? (
        <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
      ) : (
        <button
          onClick={() => onRemove(file)}
          className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default UploadedFileCard;
