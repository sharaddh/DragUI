import {
  useEffect,
  useState,
  useRef,
  useCallback
} from "react";

import socket from "../socket";

const CURSOR_EMIT_INTERVAL = 50;

export default function useCursor(
  componentId
) {

  const [
    cursors,
    setCursors
  ] = useState([]);

  const lastEmitRef =
    useRef(0);

  const onMouseMove =
    useCallback(
      (event) => {

        const now =
          Date.now();

        if (now - lastEmitRef.current < CURSOR_EMIT_INTERVAL) {
          return;
        }

        lastEmitRef.current = now;

        socket.emit(
          "cursor:update",
          {
            componentId,
            x: event.clientX,
            y: event.clientY
          }
        );

      },
      [componentId]
    );

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

  return { cursors, onMouseMove };

}
