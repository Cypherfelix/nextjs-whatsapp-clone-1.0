import React from "react";
import Avatar from "@/components/common/Avatar";
import {useStateProvider} from "@/context/StateContext";
import {reducerCases} from "@/context/constants";

function ChatLIstItem({isContactPage = false, user}) {
    const [{userInfo, currentChatUser}, dispatch] = useStateProvider();
    const handleContactClick = () => {
        dispatch({type: reducerCases.CHANGE_CURRENT_CHAT_USER, user: user});
        dispatch({type: reducerCases.SET_ALL_CONTACTS_PAGE});
    };
    return (<div onClick={handleContactClick} className={`flex cursor-pointer items-center hover:bg-background-default-hover`}>
        <div className={`min-w-fit px-5 pt-3 pb-1`}>
            <Avatar type={"sm"} image={user?.profilePicture}/>
        </div>
        <div className={"min-h-full flex flex-col justify-center mt-3 pr-2 w-full"}>
            <div className={"flex justify-between"}>
                <div>
                    <span className={"text-white "}>
                        {user?.name}
                    </span>
                </div>
            </div>
            <div className={"flex border-b border-conversation-border pb-2 pt-1 pr-2"}>
                <div className={"flex justify-between w-full"}>
                    <span className={"text-secondary line-clamp-1 text-sm"}>
                        {user?.about || "\u00A0"}
                    </span>
                </div>
            </div>
        </div>
    </div>);
}

export default ChatLIstItem;
