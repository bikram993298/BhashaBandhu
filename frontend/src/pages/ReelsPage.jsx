import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import {
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
} from "../lib/api";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";
import {
  MapPinIcon,
  UserPlusIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UsersIcon,
} from "lucide-react";
import { Link } from "react-router";

const ReelsPage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getRecommendedUsers(),
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const ids = new Set();
    if (outgoingFriendReqs?.length > 0) {
      outgoingFriendReqs.forEach((req) => ids.add(req.recipient._id));
      setOutgoingRequestsIds(ids);
    }
  }, [outgoingFriendReqs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const index = Math.round(el.scrollTop / el.clientHeight);
      setCurrentIndex(index);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (index) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: index * el.clientHeight, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)] gap-4 text-center p-6">
        <UsersIcon className="size-16 opacity-30" />
        <h2 className="text-xl font-semibold">No learners to show</h2>
        <p className="opacity-60">Check back later for new language partners!</p>
        <Link to="/" className="btn btn-primary btn-sm">
          Browse on Home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {users.map((user, idx) => {
          const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

          return (
            <div
              key={user._id}
              className="h-[calc(100vh-4rem)] snap-start relative flex items-center justify-center overflow-hidden"
            >
              {/* Blurred background */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{
                  backgroundImage: `url(${user.profilePic})`,
                  filter: "blur(20px)",
                }}
              />
              <div className="absolute inset-0 bg-base-300/75" />

              {/* Main card */}
              <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-sm px-6 py-8">
                {/* Avatar */}
                <div className="avatar">
                  <div className="w-36 h-36 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-base-300 shadow-2xl">
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Name & Location */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{user.fullName}</h2>
                  {user.location && (
                    <div className="flex items-center justify-center gap-1 mt-1 opacity-70 text-sm">
                      <MapPinIcon className="size-3.5" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>

                {/* Language badges */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="badge badge-secondary badge-lg gap-1">
                    {getLanguageFlag(user.nativeLanguage)}
                    Native: {capitialize(user.nativeLanguage)}
                  </span>
                  <span className="badge badge-outline badge-lg gap-1">
                    {getLanguageFlag(user.learningLanguage)}
                    Learning: {capitialize(user.learningLanguage)}
                  </span>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-sm opacity-75 text-center line-clamp-3 max-w-xs">
                    {user.bio}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 w-full mt-2">
                  <button
                    className={`btn flex-1 gap-2 ${
                      hasRequestBeenSent ? "btn-success btn-outline" : "btn-primary"
                    }`}
                    onClick={() =>
                      !hasRequestBeenSent && sendRequestMutation(user._id)
                    }
                    disabled={hasRequestBeenSent || isPending}
                  >
                    {hasRequestBeenSent ? (
                      <>
                        <CheckCircleIcon className="size-4" />
                        Sent
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="size-4" />
                        Connect
                      </>
                    )}
                  </button>

                  <Link to={`/chat/${user._id}`} className="btn btn-ghost flex-1 gap-2 bg-base-200/60">
                    <MessageCircleIcon className="size-4" />
                    Message
                  </Link>
                </div>
              </div>

              {/* Reel counter */}
              <div className="absolute top-4 right-4 badge badge-neutral opacity-70">
                {idx + 1} / {users.length}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        <button
          className="btn btn-circle btn-sm btn-ghost bg-base-200/60 backdrop-blur-sm"
          onClick={() => scrollTo(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronUpIcon className="size-4" />
        </button>
        <button
          className="btn btn-circle btn-sm btn-ghost bg-base-200/60 backdrop-blur-sm"
          onClick={() => scrollTo(currentIndex + 1)}
          disabled={currentIndex >= users.length - 1}
        >
          <ChevronDownIcon className="size-4" />
        </button>
      </div>

      {/* Vertical progress dots */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
        {users.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-2 h-5 bg-primary"
                : "w-2 h-2 bg-base-content/30 hover:bg-base-content/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;
