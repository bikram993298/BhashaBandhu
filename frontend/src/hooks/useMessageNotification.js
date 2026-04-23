// src/hooks/useMessageNotification.js
import { useEffect } from "react";
import toast from "react-hot-toast";

const SOUND_URL =
  "https://cdn.pixabay.com/download/audio/2022/12/17/audio_4f6b6d022a.mp3?filename=notification-chime-122204.mp3";
// Or put "notification.mp3" in public/ and use "/notification.mp3"

const useMessageNotification = (chatClient) => {
  useEffect(() => {
    if (!chatClient) return;

    const handleNewMessage = (event) => {
      const message = event.message;
      if (!message || !message.user) return;

      // 1. 🔊 Play notification sound
      try {
        const audio = new Audio(SOUND_URL);
        audio.play().catch(() => {
          // Ignore autoplay restriction errors
        });
      } catch (err) {
        console.error("Audio play error:", err);
      }

      // 2. 💬 Show toast popup
      toast(`${message.user.name}: ${message.text || "📩 New message"}`, {
        icon: "💬",
      });

      // 3. 🖥️ Browser notification
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(message.user.name, { body: message.text });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification(message.user.name, { body: message.text });
            }
          });
        }
      }
    };

    // ✅ Subscribe to message events
    chatClient.on("message.new", handleNewMessage);

    // ✅ Cleanup on unmount
    return () => {
      chatClient.off("message.new", handleNewMessage);
    };
  }, [chatClient]);
};

export default useMessageNotification;
