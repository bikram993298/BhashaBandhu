import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { MessageSquareIcon, VideoIcon, UsersIcon } from "lucide-react";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="min-h-screen bg-base-100 p-2 sm:p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="container mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Friends</h1>
          <span className="badge badge-primary badge-lg text-sm">{friends.length} connected</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <div className="card bg-base-200 p-6 sm:p-8 text-center space-y-4">
            <UsersIcon className="size-12 sm:size-16 mx-auto text-base-content opacity-30" />
            <h3 className="text-lg sm:text-xl font-semibold">No friends yet</h3>
            <p className="text-sm sm:text-base text-base-content opacity-70">
              Head to the{" "}
              <Link to="/" className="link link-primary">
                Home page
              </Link>{" "}
              to find language partners!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="card-body p-3 sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="avatar size-12 sm:size-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 sm:ring-offset-2 flex-shrink-0">
                      <img src={friend.profilePic} alt={friend.fullName} className="rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{friend.fullName}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="badge badge-secondary badge-xs sm:badge-sm">
                          {getLanguageFlag(friend.nativeLanguage)}
                          {capitialize(friend.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline badge-xs sm:badge-sm">
                          {getLanguageFlag(friend.learningLanguage)}
                          {capitialize(friend.learningLanguage)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 sm:mt-4">
                    <Link
                      to={`/chat/${friend._id}`}
                      className="btn btn-primary btn-xs sm:btn-sm flex-1 gap-1 sm:gap-2"
                    >
                      <MessageSquareIcon className="size-3 sm:size-4" />
                      <span className="hidden sm:inline">Message</span>
                      <span className="sm:hidden">Chat</span>
                    </Link>
                    <Link
                      to={`/call/${friend._id}`}
                      className="btn btn-outline btn-xs sm:btn-sm flex-1 gap-1 sm:gap-2"
                    >
                      <VideoIcon className="size-3 sm:size-4" />
                      <span className="hidden sm:inline">Call</span>
                      <span className="sm:hidden">Video</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
