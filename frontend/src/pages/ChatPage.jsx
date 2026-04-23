import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import { useChat } from "../context/ChatProvider.jsx";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import NotificationHandler from "../components/NotificationHandler";
import toast from "react-hot-toast";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { chatClient } = useChat();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatClient) return;

    const initChannel = async () => {
      const channelId = [chatClient.userID, targetUserId].sort().join("-");
      const currChannel = chatClient.channel("messaging", channelId, {
        members: [chatClient.userID, targetUserId],
      });

      await currChannel.watch();
      setChannel(currChannel);
      setLoading(false);
    };

    initChannel();
  }, [chatClient, targetUserId]);

  const handleVideoCall = () => {
    if (!channel) return;
    const callUrl = `${window.location.origin}/call/${channel.id}`;

    channel.sendMessage({ text: `I've started a video call. Join here: ${callUrl}` });
    toast.success("Video call link sent!");
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] lg:min-h-[93vh] flex flex-col bg-base-100">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <NotificationHandler />
          <div className="w-full h-full flex flex-col relative flex-1">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
