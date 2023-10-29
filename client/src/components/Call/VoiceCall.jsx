import React from "react";
import dynamic from "next/dynamic";

const Container = dynamic(() => import("@/components/Call/Container"), {
  ssr: false,
});

function VoiceCall() {
  return <div>VoiceCall</div>;
}

export default VoiceCall;
