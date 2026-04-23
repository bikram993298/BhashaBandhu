import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStory } from "../../lib/api";
import { Upload, X, Type, Image as ImageIcon, Video } from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGES } from "../../constants";

const COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#f97316", // orange
];

// Cloudinary upload widget script loader
const loadCloudinaryWidget = () => {
  if (!window.cloudinary) {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }
};

const StoryCreator = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [storyType, setStoryType] = useState("text"); // text, image, video
  const [textContent, setTextContent] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);
  const [languageTag, setLanguageTag] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    loadCloudinaryWidget();
  }, []);

  const { mutate: createStoryMutation, isPending } = useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story posted!");
      onClose();
    },
    onError: (error) => {
      console.error("Error creating story:", error);
      toast.error(error.response?.data?.message || "Error creating story");
    },
  });

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      toast.error("Cloudinary widget failed to load");
      return;
    }
    
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME",
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET",
        resourceType: storyType === "video" ? "video" : "image",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setMediaUrl(result.info.secure_url);
          setPreview(result.info.secure_url);
          toast.success("Media uploaded successfully!");
        }
      }
    );
    widget.open();
  };

  const handleCreateStory = () => {
    if (!languageTag) {
      toast.error("Please select a language");
      return;
    }

    if (storyType === "text") {
      if (!textContent.trim()) {
        toast.error("Please enter some text");
        return;
      }

      createStoryMutation({
        mediaType: "text",
        textContent: textContent.trim(),
        backgroundColor,
        languageTag,
      });
    } else {
      if (!mediaUrl) {
        toast.error("Please upload a media file");
        return;
      }

      createStoryMutation({
        mediaType: storyType,
        mediaUrl,
        languageTag,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Story</h2>
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Story Type Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setStoryType("text");
              setPreview("");
            }}
            className={`flex-1 btn btn-sm gap-2 ${
              storyType === "text" ? "btn-primary" : "btn-outline"
            }`}
          >
            <Type className="size-4" />
            Text
          </button>
          <button
            onClick={() => {
              setStoryType("image");
              setTextContent("");
            }}
            className={`flex-1 btn btn-sm gap-2 ${
              storyType === "image" ? "btn-primary" : "btn-outline"
            }`}
          >
            <ImageIcon className="size-4" />
            Image
          </button>
          <button
            onClick={() => {
              setStoryType("video");
              setTextContent("");
            }}
            className={`flex-1 btn btn-sm gap-2 ${
              storyType === "video" ? "btn-primary" : "btn-outline"
            }`}
          >
            <Video className="size-4" />
            Video
          </button>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="label">
            <span className="label-text font-semibold">🗣️ Language Tag</span>
          </label>
          <select
            value={languageTag}
            onChange={(e) => setLanguageTag(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Select a language...</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Text Story Editor */}
        {storyType === "text" && (
          <>
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-semibold">✍️ Text Content</span>
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Write your story (e.g., a word of the day, cultural fact, etc.)"
                className="textarea textarea-bordered w-full h-24"
              />
              <p className="text-xs text-base-content/60 mt-1">
                {textContent.length} / 500 characters
              </p>
            </div>

            {/* Color Picker */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-semibold">🎨 Background Color</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={`size-10 rounded transition-transform hover:scale-110 ring-2 ${
                      backgroundColor === color
                        ? "ring-primary ring-offset-2"
                        : "ring-base-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-semibold">👁️ Preview</span>
              </label>
              <div
                className="w-full h-40 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ backgroundColor }}
              >
                <p className="text-3xl font-bold text-white text-center px-4 break-words">
                  {textContent || "Your text here"}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Image/Video Upload */}
        {(storyType === "image" || storyType === "video") && (
          <div className="mb-6">
            <label className="label">
              <span className="label-text font-semibold">
                {storyType === "image" ? "🖼️ Upload Image" : "🎥 Upload Video"}
              </span>
            </label>

            {!preview ? (
              <button
                onClick={openCloudinaryWidget}
                className="w-full border-2 border-dashed border-base-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-primary transition cursor-pointer"
                type="button"
              >
                <Upload className="size-8 mb-2 text-base-300" />
                <span className="text-sm font-medium">
                  {`Click to upload ${storyType}`}
                </span>
              </button>
            ) : (
              <div className="relative">
                {storyType === "image" ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-lg max-h-48 object-cover"
                  />
                ) : (
                  <video
                    src={preview}
                    className="w-full rounded-lg max-h-48 object-cover"
                    controls
                  />
                )}
                <button
                  onClick={() => {
                    setPreview("");
                    setMediaUrl("");
                  }}
                  className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-base-200/80"
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-outline flex-1">
            Cancel
          </button>
          <button
            onClick={handleCreateStory}
            disabled={isPending}
            className="btn btn-primary flex-1"
          >
            {isPending ? "Posting..." : "Post Story"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCreator;
