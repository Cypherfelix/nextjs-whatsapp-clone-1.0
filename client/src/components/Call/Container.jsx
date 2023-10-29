import React, { useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import { MdCallEnd, MdOutlineCallEnd } from "react-icons/md";
import { reducerCases } from "@/context/constants";

function Container({ data }) {
  console.log(data);
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);

  const handleEndCall = () => {
    dispatch({
      type: reducerCases.END_CALL,
    });
  };

  return (
    <div
      className={
        "border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white"
      }
    >
      <div className={"flex flex-col gap-3 items-center"}>
        <span className={"text-5xl"}>{data.name}</span>
        <span className={"text-lg"}>
          {callAccepted && data.callType !== "video"
            ? "On going call"
            : "Calling..."}
        </span>
      </div>
      {(!callAccepted || data.callType === "voice") && (
        <div className={"my-24"}>
          <Image
            src={data.profilePicture}
            alt={data.name}
            height={300}
            width={300}
            className={"rounded-full"}
          />
        </div>
      )}
      <div
        className={
          "h-16 w-16 bg-red-600 flex items-center justify-center rounded-full"
        }
      >
        <MdOutlineCallEnd
          className={"text-3xl cursor-pointer"}
          onClick={handleEndCall}
        />
      </div>
    </div>
  );
}

export default Container;
