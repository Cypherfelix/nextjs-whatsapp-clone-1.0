import React, { useEffect } from "react";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import ChatLIstItem from "@/components/Chatlist/ChatLIstItem";

function List() {
  const [{ userInfo, userContacts, filteredContacts, searchTerm }, dispatch] =
    useStateProvider();

  useEffect(() => {
    const getContacts = async () => {
      // if (userInfo) {
      try {
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);

        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers: onlineUsers,
        });
        dispatch({ type: reducerCases.SET_CONTACTS, userContacts: users });

        console.log(users);
        console.log(onlineUsers);
      } catch (error) {
        console.log(error);
      }
      // }
    };

    getContacts().then((r) => console.log());
  }, [userInfo]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && searchTerm.length > 0
        ? filteredContacts.map((contact) => (
            <ChatLIstItem key={contact.id} user={contact} />
          ))
        : userContacts &&
          userContacts.map((contact) => (
            <ChatLIstItem key={contact.id} user={contact} />
          ))}
    </div>
  );
}

export default List;
