import { Image, X, Send } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const ChatInput = () => {
  const [text, setText] = useState<string>("");
  const [imagePreview, setimagePreview] = useState<any>(null);
  const { sendmessage } = useChatStore();

  const fileInput = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    console.log("File type:", file.type);
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setimagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setimagePreview("");
    if (fileInput.current) fileInput.current.value = "";
  };
  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) {
      console.log("Error he bhai");
      return;
    }
    try {
      await sendmessage({ text: text.trim(), image: imagePreview });
      console.log(text, imagePreview);
      setText("");
      setimagePreview(null);
      if (fileInput.current) fileInput.current.value == "";
    } catch (error) {
      console.log("Failed to send Message", error);
    }
  };

  return (
    <div className="w-full p-2 ">
      {imagePreview && (
        <div className=" mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form className="flex-1 flex w-full" onSubmit={handleSendMessage}>
        <input
          className="flex border border-gray-400 w-[85%] h-12 rounded-lg px-2 outline-none"
          type="text"
          name="input"
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          placeholder="Type a Message"
        />
        <div className="flex-1 flex space-x-5 justify-center items-center">
          <input
            className="hidden"
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className={`hover:shadow-gray-400 shadow-lg hover:scale-105 ${
              imagePreview ? "text-green" : "text-gray"
            }`}
          >
            <Image size="28" />
          </button>
          <button
            type="submit"
            className=" p-2 rounded-full"
            disabled={!text.trim() && !imagePreview}
          >
            <Send
              color={text.trim() || imagePreview ? "green" : "gray"}
              size={26}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
