import React from "react";
import dynamic from "next/dynamic";
import { useStateProvider } from "@/context/StateContext";

const Container = dynamic(() => import("@/components/Call/Container"), {
  ssr: false,
});

function VideoCall() {
  const [{ videoCall, socket, userInfo }] = useStateProvider();
  return <Container data={videoCall} />;
}

export default VideoCall;
