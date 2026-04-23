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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Friends</h1>
          <span className="badge badge-primary badge-lg">{friends.length} connected</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <div className="card bg-base-200 p-8 text-center space-y-4">
            <UsersIcon className="size-16 mx-auto text-base-content opacity-30" />
            <h3 className="text-xl font-semibold">No friends yet</h3>
            <p className="opacity-60">
              Head to the{" "}
              <Link to="/" className="link link-primary">
                Home page
              </Link>{" "}
              to find language partners!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="card-body p-5">
                  <div className="flex items-center gap-4">
                    <div className="avatar size-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={friend.profilePic} alt={friend.fullName} className="rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{friend.fullName}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="badge badge-secondary badge-sm">
                          {getLanguageFlag(friend.nativeLanguage)}
                          {capitialize(friend.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline badge-sm">
                          {getLanguageFlag(friend.learningLanguage)}
                          {capitialize(friend.learningLanguage)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/chat/${friend._id}`}
                      className="btn btn-primary btn-sm flex-1 gap-2"
                    >
                      <MessageSquareIcon className="size-4" />
                      Message
                    </Link>
                    <Link
                      to={`/call/${friend._id}`}
                      className="btn btn-outline btn-sm flex-1 gap-2"
                    >
                      <VideoIcon className="size-4" />
                      Call
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
