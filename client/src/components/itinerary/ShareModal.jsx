import { useState } from "react";
import { Copy, MessageCircle, Link2, RefreshCw, EyeOff, CheckCircle } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import toast from "react-hot-toast";
import copyToClipboard from "../../utils/copyToClipboard";
import { enableSharing, disableSharing, regenerateShareLink } from "../../api/itinerary.api";

const ShareModal = ({ isOpen, onClose, itinerary, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = itinerary?.shareId
    ? `${window.location.origin}/shared/${itinerary.shareId}`
    : "";

  const handleEnable = async () => {
    setLoading(true);
    try {
      const res = await enableSharing(itinerary._id);
      onUpdate({ ...itinerary, isPublic: true, shareId: res.data.data.shareId });
      toast.success("Sharing enabled!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await disableSharing(itinerary._id);
      onUpdate({ ...itinerary, isPublic: false });
      toast.success("Sharing disabled");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await regenerateShareLink(itinerary._id);
      onUpdate({ ...itinerary, isPublic: true, shareId: res.data.data.shareId });
      toast.success("Share link regenerated!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out my travel itinerary to ${itinerary.destination}! ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Itinerary" size="md">
      <div className="space-y-5">
        <p className="text-sm text-gray-500">
          Share your trip to{" "}
          <span className="font-semibold text-gray-800">{itinerary?.destination}</span>{" "}
          with anyone — no login required.
        </p>

        {itinerary?.isPublic ? (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-medium mb-2 flex items-center gap-1">
                <Link2 size={12} /> Public share link
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 input text-xs bg-white"
                />
                <Button
                  size="sm"
                  variant={copied ? "success" : "primary"}
                  onClick={handleCopy}
                  className="flex-shrink-0"
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWhatsApp}
                className="flex-1 bg-green-50 text-green-700 hover:bg-green-100"
              >
                <MessageCircle size={15} />
                WhatsApp
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                loading={loading}
                className="flex-1"
              >
                <RefreshCw size={14} />
                New Link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisable}
                loading={loading}
                className="flex-1 text-red-600 hover:bg-red-50"
              >
                <EyeOff size={14} />
                Disable
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Link2 className="text-gray-400" size={24} />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Sharing is currently disabled. Enable it to generate a public link.
            </p>
            <Button onClick={handleEnable} loading={loading} className="w-full">
              Enable Sharing
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShareModal;
