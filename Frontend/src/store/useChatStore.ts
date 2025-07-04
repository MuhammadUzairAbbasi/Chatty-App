import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

interface ChatStore {
  messages: any;
  users: any;
  selectedUser: any;
  isMessageLoading: boolean;
  isUsersLoading: boolean;

  getUser: () => Promise<void>;
  getmessages: (userId: any) => Promise<void>;
  sendmessage: (data: any) => Promise<void>;
  setselectedUser: (selectedUser: any) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isMessageLoading: false,
  isUsersLoading: false,

  getUser: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getmessages: async (userId: any) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendmessage: async (data: any) => {
    const { messages, selectedUser } = get();
    try {
      console.log(data);

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data
      );
      console.log(res);

      set({ messages: [...messages, res.data] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  // Optimie later
  setselectedUser: (selectedUser: any) => set({ selectedUser }),
}));
