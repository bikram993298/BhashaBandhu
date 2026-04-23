const StoryRing = ({ user, stories, hasUnviewed, onClick }) => {
  // Get unique languages from stories
  const languages = stories && stories.length > 0 
    ? [...new Set(stories.map(s => s.languageTag).filter(Boolean))]
    : [];

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 flex-shrink-0 group hover:opacity-80 transition-opacity"
      title={`View ${user.fullName}'s stories`}
    >
      <div
        className={`size-16 rounded-full flex-shrink-0 ring-2 transition-all group-hover:ring-4 flex items-center justify-center overflow-hidden relative ${
          hasUnviewed
            ? "ring-primary bg-gradient-to-br from-primary/20 to-secondary/20"
            : "ring-base-300"
        }`}
      >
        <img
          src={user.profilePic}
          alt={user.fullName}
          className="w-full h-full object-cover"
        />
        
        {/* Story count badge */}
        {stories && stories.length > 0 && (
          <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
            {stories.length}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 flex-col w-full">
        <span className="text-xs font-medium text-center w-14 truncate">{user.fullName}</span>
        
        {/* Show language tags */}
        {languages.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-center">
            {languages.slice(0, 2).map((lang) => (
              <span key={lang} className="badge badge-xs badge-primary">
                🗣️ {lang}
              </span>
            ))}
            {languages.length > 2 && (
              <span className="badge badge-xs badge-ghost">+{languages.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default StoryRing;
