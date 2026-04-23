import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, BookOpen, Globe, Users, Trophy, Target, MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../lib/api";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("language-partner");
  const messagesEndRef = useRef(null);

  const features = [
    { id: "language-partner", name: "AI Language Partner", icon: MessageCircle, description: "Practice conversations", placeholder: "Type your message in any language..." },
    { id: "grammar-correction", name: "Grammar Correction", icon: BookOpen, description: "Fix your grammar", placeholder: "Type a sentence to check grammar..." },
    { id: "word-explainer", name: "Word Explainer", icon: Sparkles, description: "Learn word meanings", placeholder: "Enter a word to explain..." },
    { id: "translation", name: "Translation", icon: Globe, description: "Translate text", placeholder: "Type text to translate..." },
    { id: "cultural-context", name: "Cultural Context", icon: Users, description: "Learn cultural aspects", placeholder: "Enter a term or concept..." },
    { id: "roleplay", name: "Roleplay", icon: Target, description: "Practice scenarios", placeholder: "Describe a scenario (e.g., 'ordering food at a restaurant')..." },
    { id: "word-of-day", name: "Word of Day", icon: Trophy, description: "Daily learning", placeholder: "Enter difficulty level (beginner/intermediate/advanced)..." },
    { id: "challenge-judge", name: "Challenge Judge", icon: Trophy, description: "Get feedback", placeholder: "Paste your conversation log..." },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async ({ feature, message }) => {
      let requestBody = {};

      // Map features to their expected parameter names
      switch (feature) {
        case 'word-explainer':
          requestBody = { word: message };
          break;
        case 'cultural-context':
          requestBody = { term: message };
          break;
        case 'roleplay':
          requestBody = { scenario: message };
          break;
        case 'word-of-day':
          requestBody = { difficulty: message || 'beginner' };
          break;
        case 'challenge-judge':
          requestBody = { conversationLog: message };
          break;
        case 'translation':
          requestBody = {
            message,
            sourceLanguage: 'English', // You might want to make this configurable
            targetLanguage: 'Hindi'   // You might want to make this configurable
          };
          break;
        default:
          requestBody = { message };
      }

      const response = await api.post(`/chat/${feature}`, requestBody);
      return response.data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "ai",
        content: data.response,
        feature: selectedFeature,
        timestamp: new Date()
      }]);
    },
    onError: (error) => {
      toast.error("Failed to get AI response. Please try again.");
      console.error("Chat error:", error);
    }
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now() - 1,
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input;
    setInput("");

    chatMutation.mutate({ feature: selectedFeature, message: messageToSend });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getFeatureIcon = (featureId) => {
    const feature = features.find(f => f.id === featureId);
    const IconComponent = feature?.icon || Bot;
    return <IconComponent className="size-4" />;
  };

  return (
    <div className="flex h-screen bg-base-100">
      {/* Features Sidebar */}
      <div className="w-80 bg-base-200 border-r border-base-300 flex flex-col">
        <div className="p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="size-5 text-primary" />
            AI Learning Assistant
          </h2>
          <p className="text-sm text-base-content/70 mt-1">
            Choose a feature to start learning
          </p>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature.id)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedFeature === feature.id
                  ? "bg-primary text-primary-content shadow-md"
                  : "bg-base-100 hover:bg-base-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <feature.icon className="size-5" />
                <div>
                  <div className="font-medium text-sm">{feature.name}</div>
                  <div className="text-xs opacity-70">{feature.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-base-300">
          <div className="text-xs text-base-content/60">
            💡 Tip: Start with "AI Language Partner" for natural conversations
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-base-300 bg-base-200">
          <div className="flex items-center gap-3">
            {getFeatureIcon(selectedFeature)}
            <div>
              <h3 className="font-semibold">
                {features.find(f => f.id === selectedFeature)?.name}
              </h3>
              <p className="text-sm text-base-content/70">
                {features.find(f => f.id === selectedFeature)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-base-content/50 mt-20">
              <Bot className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Start a conversation!</p>
              <p className="text-sm">
                Send a message to begin learning with AI assistance.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "ai" && (
                <div className="avatar">
                  <div className="w-8 rounded-full bg-primary">
                    <Bot className="size-4 text-primary-content m-2" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.type === "user" && (
                <div className="avatar">
                  <div className="w-8 rounded-full bg-secondary">
                    <User className="size-4 text-secondary-content m-2" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="avatar">
                <div className="w-8 rounded-full bg-primary">
                  <Bot className="size-4 text-primary-content m-2" />
                </div>
              </div>
              <div className="bg-base-200 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="loading loading-dots loading-sm"></div>
                  <span className="text-sm text-base-content/70">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-base-300 bg-base-200">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={features.find(f => f.id === selectedFeature)?.placeholder || "Ask the AI..."}
              className="flex-1 textarea textarea-bordered resize-none"
              rows={1}
              disabled={chatMutation.isPending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || chatMutation.isPending}
              className="btn btn-primary"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;