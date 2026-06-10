import {
  useEffect,
  useState
} from "react";

import socket from "../socket";

export default function usePresence(
  componentId,
  currentUser
) {

  const [
    users,
    setUsers
  ] = useState([]);

  useEffect(() => {

    socket.emit(
      "presence:join",
      {
        componentId,
        user: currentUser
      }
    );

    socket.on(
      "presence:update",
      setUsers
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
        "presence:update"
      );

    };

  }, []);

  return users;

}