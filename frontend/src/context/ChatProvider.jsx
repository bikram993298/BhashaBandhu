// src/context/ChatProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const [chatClient, setChatClient] = useState(null);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!authUser || !tokenData?.token) return;

    const initChat = async () => {
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Only connect if not already connected
        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        setChatClient(client);
      } catch (err) {
        console.error("Stream chat connection error:", err);
        toast.error("Could not connect to chat.");
      }
    };

    initChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [authUser, tokenData]);

  return (
    <ChatContext.Provider value={{ chatClient }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
