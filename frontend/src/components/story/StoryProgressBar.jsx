import { useEffect, useState } from "react";

const StoryProgressBar = ({ currentIndex, totalStories, autoAdvanceTime = 5000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (autoAdvanceTime / 100));
        return next >= 100 ? 100 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, autoAdvanceTime]);

  return (
    <div className="flex gap-1 px-4 pt-3">
      {[...Array(totalStories)].map((_, idx) => (
        <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className={`h-full bg-white transition-all duration-100 ${
              idx < currentIndex
                ? "w-full"
                : idx === currentIndex
                ? "w-full"
                : "w-0"
            }`}
            style={{
              width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? "100%" : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StoryProgressBar;
