import React, { useEffect, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";

function Main() {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [{ userInfo }, dispatch] = useStateProvider();

  const router = useRouter();

  useEffect(() => {
    if (redirectLogin) {
      router.push("/login");
    }
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      setRedirectLogin(true);
    }

    if (!userInfo && user?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: user.email,
      });

      if (!data.status) {
        const { displayName: name, photoURL: profileImage, email } = user;
        dispatch({
          type: reducerCases.SET_NEW_USER,
          newUser: true,
        });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            name,
            email,
            status: "",
          },
        });
        router.push("/onboarding");
      } else {
        dispatch({
          type: reducerCases.SET_NEW_USER,
          newUser: false,
        });

        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            name: data.user.name,
            email: data.user.email,
            profileImage: data.user.profilePicture,
            about: data.user.about,
            status: data.status,
          },
        });
      }
    }
  });
  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden ">
        <ChatList />
        <Empty />
      </div>
    </>
  );
}

export default Main;
