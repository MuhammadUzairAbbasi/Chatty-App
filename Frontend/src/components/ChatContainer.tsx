import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getmessages,
    isMessageLoading,
    selectedUser,
    subscribeMessages,
    unsubscribeMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  console.log(messages);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getmessages(selectedUser._id);
    subscribeMessages();
    return () => unsubscribeMessages();
  }, [selectedUser._id, getmessages, subscribeMessages, unsubscribeMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex flex-1 flex-col w-full h-full overflow-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col w-full h-full overflow-hidden">
      <ChatHeader />
      <div className="h-[90%] flex-1 overflow-y-auto">
        {messages.map((message: any) => {
          return (
            <div
              ref={messageEndRef}
              key={message._id}
              className={`chat ${
                message.senderId == authUser._id ? "chat-end" : "chat-start"
              } `}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      message.senderId == authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profilePic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    className="max-w-[200px] rounded-md mb-2"
                    src={message.image}
                    alt="attachment"
                  />
                )}
                {message.text && <p className="">{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
