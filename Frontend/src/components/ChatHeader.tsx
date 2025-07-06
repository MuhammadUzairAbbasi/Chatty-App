import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Users, X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="flex justify-between items-center h-14 border-b border-gray-400 p-3">
      <div className="flex items-center justify-center space-x-3">
        <button className="border border-gray-300 rounded-full p-1">
          {!selectedUser && selectedUser.profilePic === " " ? (
            <div className="flex items-center justify-center p-2 rounded-full ">
              <Users className="size-10" color="gray" />
            </div>
          ) : (
            <>
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.fullName}
                className="size-10 rounded-full"
              />
            </>
          )}
        </button>
        <div className="flex flex-col justify-center">
          <p className="text-base font-semibold">{selectedUser.fullName}</p>
          <p className="text-sm">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "offline"}
          </p>
        </div>
      </div>
      <button className=" border border-gray-300 rounded-lg p-2 hover:bg-gray-300">
        <X />
      </button>
    </div>
  );
};

export default ChatHeader;
