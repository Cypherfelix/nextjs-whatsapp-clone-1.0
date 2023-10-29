import React from "react";
import dynamic from "next/dynamic";

const Container = dynamic(() => import("@/components/Call/Container"), {
  ssr: false,
});

function VideoCall() {
  return <div>VideoCall</div>;
}

export default VideoCall;
