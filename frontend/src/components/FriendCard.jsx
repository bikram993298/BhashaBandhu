import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow h-full">
      <div className="card-body p-3 sm:p-4 flex flex-col">
        {/* USER INFO */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="avatar size-10 sm:size-12 flex-shrink-0">
            <img src={friend.profilePic} alt={friend.fullName} className="object-cover" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base truncate flex-1">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            <span className="hidden sm:inline">Native:</span> {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            <span className="hidden sm:inline">Learning:</span> {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline btn-xs sm:btn-sm w-full mt-auto">
          <span className="text-xs sm:text-sm">Message</span>
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-2.5 sm:h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
