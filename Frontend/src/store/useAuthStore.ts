import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

interface AuthStore {
  authUser: any;
  isSigningUp: boolean;
  isLoggingUp: boolean;
  isUpdatingProfile: boolean;
  ischeckingAuth: boolean;
  onlineUsers: any;
  socket: any;
  checkAuth: () => Promise<void>;
  signUp: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: any) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingUp: false,
  isUpdatingProfile: false,
  ischeckingAuth: true,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ ischeckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signUp", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingUp: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login Successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout Successfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated Successfully");
    } catch (error: any) {
      console.log("Error in updateProfile", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    if (!get().authUser && get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_BASEURL, {});
    socket.connect();
    set({ socket: socket });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
