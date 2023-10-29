import React from "react";
import Avatar from "@/components/common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "@/components/common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({ isContactPage = false, user }) {
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
  console.log(user.senderId, userInfo.id);
  const handleContactClick = () => {
    if (isContactPage) {
      dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
      dispatch({ type: reducerCases.CHANGE_CURRENT_CHAT_USER, user: user });
    } else {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        user: {
          ...user,
        },
      });
    }
  };
  return (
    <div
      onClick={handleContactClick}
      className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
    >
      <div className={`min-w-fit px-5 pt-3 pb-1`}>
        <Avatar type={"sm"} image={user?.profilePicture} />
      </div>
      <div
        className={"min-h-full flex flex-col justify-center mt-3 pr-2 w-full"}
      >
        <div className={"flex justify-between"}>
          <div>
            <span className={"text-white "}>{user?.name}</span>
          </div>
          {!isContactPage && (
            <div>
              <span
                className={`text-sm ${
                  !user.totalUnreadMessages > 0 || user.senderId === userInfo.id
                    ? "text-secondary"
                    : "text-icon-green"
                }`}
              >
                {calculateTime(user.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div
          className={"flex border-b border-conversation-border pb-2 pt-1 pr-2"}
        >
          <div className={"flex justify-between w-full"}>
            <span className={"text-secondary line-clamp-1 text-sm"}>
              {isContactPage ? (
                user?.about || "\u00A0"
              ) : (
                <div
                  className={
                    "flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]"
                  }
                >
                  {user?.senderId === userInfo?.id && (
                    <MessageStatus messageStatus={user?.messageStatus} />
                  )}
                  {user.type === "text" && (
                    <span className={"truncate"}>{user.message}</span>
                  )}
                  {user.type === "audio" && (
                    <span className={"flex gap-1 items-center"}>
                      <FaMicrophone className={"text-panel-header-icon"} />
                      Audio
                    </span>
                  )}
                  {user.type === "image" && (
                    <span className={"flex gap-1 items-center"}>
                      <FaCamera className={"text-panel-header-icon"} />
                      Image
                    </span>
                  )}
                </div>
              )}
            </span>
            {user.totalUnreadMessages > 0 && user.senderId !== userInfo.id && (
              <span className={"bg-icon-green px-[5px] rounded-full text-sm"}>
                {user.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
