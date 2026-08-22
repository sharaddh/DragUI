import {
  useEffect,
  useState
} from "react";

import socket, { connectSocket } from "../socket";

export default function usePresence(
  componentId,
  currentUser
) {

  const [
    users,
    setUsers
  ] = useState([]);

  useEffect(() => {

    if (!componentId || !currentUser) {
      return;
    }

    connectSocket();

    const handlePresenceUpdate =
      (data) => {
        setUsers(data);
      };

    socket.emit(
      "presence:join",
      {
        componentId,
        user: currentUser
      }
    );

    socket.on(
      "presence:update",
      handlePresenceUpdate
    );

    return () => {

      socket.emit(
        "presence:leave",
        {
          componentId,
          user: currentUser
        }
      );

      socket.off(
        "presence:update",
        handlePresenceUpdate
      );

    };

  }, [componentId, currentUser]);

  return users;

}
