import { useEffect } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { useChat } from "../context/ChatProvider.jsx";

const NotificationHandler = () => {
  const { messages } = useChannelStateContext();
  const { chatClient } = useChat();

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    if (latestMessage.user.id === chatClient.userID) return; // Don't notify for own messages

    // Request notification permission if not granted
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      new Notification(`New message from ${latestMessage.user.name}`, {
        body: latestMessage.text,
        icon: latestMessage.user.image,
      });
    }

    // Play notification sound
    const audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"); // Placeholder sound URL
    audio.play().catch(() => {}); // Ignore errors if sound fails

  }, [messages, chatClient]);

  return null;
};

export default NotificationHandler;