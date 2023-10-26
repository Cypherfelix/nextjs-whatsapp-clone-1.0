import React, { useEffect, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import EmojiPicker, { Theme } from "emoji-picker-react";
import PhotoPicker from "@/components/common/PhotoPicker";

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = React.useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);

  useEffect(() => {
    if (grabPhoto) {
      document.getElementById("photo-picker").click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.id !== "emoji-picker") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id,
        },
      });

      if (response.status === 201) {
        socket.current.emit("msg-send", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: { ...response.data.message },
        });
        setMessage("");
      }
    } catch (e) {
      console.log(e);
    }
    // const reader = new FileReader();
    //
    // const data = document.createElement("img");
    // reader.onload = (e) => {
    //     data.src = e.target.result;
    //     data.setAttribute("data-src", e.target.result);
    // };
    //
    // reader.readAsDataURL(file);
    // setTimeout(() => {
    //     setImage(data.src);
    // }, 100);
  };

  const sendMessage = async () => {
    try {
      console.log(currentChatUser, userInfo, message);
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: message,
      });
      socket.current.emit("msg-send", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: { ...data.message },
      });
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
            onClick={handleEmojiModal}
            id={"emoji-picker"}
          />
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className={"absolute bottom-24" + " left-16" + " z-40"}
            >
              <EmojiPicker theme={Theme.DARK} onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach File"
            onClick={() => setGrabPhoto(true)}
          />
        </div>

        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5  w-full py-4"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="flex w-10 items-center justify-center">
          <MdSend
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Send Message"
            onClick={sendMessage}
          />
          {/* <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl" title="Send Message" /> */}
        </div>
      </>
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </div>
  );
}

export default MessageBar;
