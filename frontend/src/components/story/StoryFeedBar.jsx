import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getStoryFeed } from "../../lib/api";
import StoryRing from "./StoryRing";
import StoryCreator from "./StoryCreator";
import StoryViewer from "./StoryViewer";

const StoryFeedBar = () => {
  const { data: feed = [], isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: getStoryFeed,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [showCreator, setShowCreator] = useState(false);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto p-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="size-16 rounded-full bg-base-300 flex-shrink-0" />
        ))}
      </div>
    );
  }

  const selectedAuthor = feed.find((item) => item.author._id === selectedAuthorId);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto p-3 bg-base-100 rounded-lg scrollbar-hide border border-base-200">
        {/* Add Story Button */}
        <button
          onClick={() => setShowCreator(true)}
          className="flex flex-col items-center gap-1 flex-shrink-0 group"
          title="Add Story"
        >
          <div className="size-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:shadow-lg transition-shadow flex-shrink-0">
            <span className="text-2xl">+</span>
          </div>
          <span className="text-xs font-medium text-center w-16 truncate">Your Story</span>
        </button>

        {/* Friends' Stories */}
        {feed.map(({ author, stories, hasUnviewed }) => (
          <StoryRing
            key={author._id}
            user={author}
            stories={stories}
            hasUnviewed={hasUnviewed}
            onClick={() => setSelectedAuthorId(author._id)}
          />
        ))}
      </div>

      {/* Story Creator Modal */}
      {showCreator && <StoryCreator onClose={() => setShowCreator(false)} />}

      {/* Story Viewer */}
      {selectedAuthor && (
        <StoryViewer
          author={selectedAuthor.author}
          stories={selectedAuthor.stories}
          onClose={() => setSelectedAuthorId(null)}
          onNext={() => {
            // Find next author with unviewed stories or just move forward
            const currentIndex = feed.findIndex((item) => item.author._id === selectedAuthorId);
            if (currentIndex < feed.length - 1) {
              setSelectedAuthorId(feed[currentIndex + 1].author._id);
            } else {
              setSelectedAuthorId(null);
            }
          }}
        />
      )}
    </>
  );
};

export default StoryFeedBar;
