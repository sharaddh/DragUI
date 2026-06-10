import {
  useEffect,
  useState
} from "react";

import socket from "../socket";

export default function useCursor(
  componentId
) {

  const [
    cursors,
    setCursors
  ] = useState([]);

  useEffect(() => {

    const handler =
      (data) => {

        setCursors(
          (prev) => {

            const filtered =
              prev.filter(
                (c) =>
                  c.userId !==
                  data.userId
              );

            return [
              ...filtered,
              data
            ];

          }
        );

      };

    socket.on(
      "cursor:update",
      handler
    );

    return () => {

      socket.off(
        "cursor:update",
        handler
      );

    };

  }, []);

  return cursors;

}