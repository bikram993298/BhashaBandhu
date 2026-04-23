import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  viewStory,
  reactToStory,
  getStoryViewers,
} from "../../lib/api";
import StoryProgressBar from "./StoryProgressBar";
import { ChevronLeft, ChevronRight, Heart, Smile, X } from "lucide-react";
import toast from "react-hot-toast";

const EMOJI_REACTIONS = ["❤️", "😂", "😍", "🔥", "👏", "🙌"];

const StoryViewer = ({ author, stories, onClose, onNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [showViewers, setShowViewers] = useState(false);

  const currentStory = stories[currentIndex];

  // Track view
  useEffect(() => {
    if (currentStory) {
      viewStory(currentStory._id).catch((err) => console.error("Error viewing story:", err));
    }
  }, [currentStory]);

  // Auto-advance to next story
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        onNext?.();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, stories.length, onNext]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, stories.length]);

  const { mutate: reactMutate } = useMutation({
    mutationFn: (emoji) => reactToStory(currentStory._id, emoji),
    onSuccess: () => {
      setShowReactions(false);
      toast.success("Reaction sent!");
    },
  });

  const { data: viewers } = useQuery({
    queryKey: ["storyViewers", currentStory._id],
    queryFn: () => getStoryViewers(currentStory._id),
    enabled: showViewers && author._id === currentStory.author,
  });

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onNext?.();
    }
  };

  const handleReaction = (emoji) => {
    reactMutate(emoji);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md md:max-w-lg flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 btn btn-circle btn-ghost text-white hover:bg-white/20"
        >
          <X className="size-6" />
        </button>

        {/* Progress Bar */}
        <StoryProgressBar currentIndex={currentIndex} totalStories={stories.length} />

        {/* Author Info and Language Tag */}
        <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={author.profilePic}
              alt={author.fullName}
              className="size-10 rounded-full object-cover ring-2 ring-white"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">{author.fullName}</h3>
                {currentStory.languageTag && (
                  <span className="badge badge-sm badge-primary text-white">
                    🗣️ {currentStory.languageTag}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/70">
                {new Date(currentStory.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* View Count */}
          <button
            onClick={() => setShowViewers(!showViewers)}
            className="text-xs text-white/70 hover:text-white transition"
          >
            👁️ {currentStory.viewers?.length || 0}
          </button>
        </div>

        {/* Story Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden relative bg-black">
          {currentStory.mediaType === "image" && (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="max-h-full max-w-full object-contain"
            />
          )}

          {currentStory.mediaType === "video" && (
            <video
              src={currentStory.mediaUrl}
              className="max-h-full max-w-full object-contain"
              autoPlay
              muted
              controls
            />
          )}

          {currentStory.mediaType === "text" && (
            <div
              className="w-full h-full flex items-center justify-center p-8"
              style={{ backgroundColor: currentStory.backgroundColor }}
            >
              <div className="text-center">
                <p className="text-4xl md:text-6xl font-bold text-white leading-relaxed break-words">
                  {currentStory.textContent}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white hover:bg-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {currentIndex < stories.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white hover:bg-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>

        {/* Footer - Reactions & Reactions Count */}
        <div className="px-4 py-3 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {currentStory.reactions?.slice(0, 3).map((reaction, idx) => (
              <div
                key={idx}
                className="text-2xl hover:scale-125 transition cursor-pointer"
                title={reaction.user?.fullName}
              >
                {reaction.emoji}
              </div>
            ))}
            {currentStory.reactions?.length > 3 && (
              <span className="text-xs text-white/70">+{currentStory.reactions.length - 3}</span>
            )}
          </div>

          {/* Reaction Button */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="btn btn-sm btn-ghost text-white hover:bg-white/20"
            >
              <Smile className="size-5" />
            </button>

            {showReactions && (
              <div className="absolute bottom-12 right-0 bg-base-200 rounded-lg p-2 flex gap-2 shadow-lg">
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-2xl hover:scale-125 transition cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Viewers Modal */}
        {showViewers && viewers && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur flex items-center justify-center rounded-lg p-4">
            <div className="bg-base-100 rounded-lg p-4 max-w-sm w-full max-h-96 overflow-y-auto">
              <h3 className="font-bold text-lg mb-4">Viewed by ({viewers.viewCount})</h3>
              <div className="space-y-3">
                {viewers.viewers?.map((viewer) => (
                  <div key={viewer._id} className="flex items-center gap-3">
                    <img
                      src={viewer.profilePic}
                      alt={viewer.fullName}
                      className="size-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">{viewer.fullName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
