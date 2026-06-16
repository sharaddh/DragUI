export default function registerCollaboration(
  io,
  socket
) {

  socket.on(
    "editor:join",
    ({ componentId }) => {

      socket.join(
        componentId
      );

    }
  );

  socket.on(
    "editor:update",
    (payload) => {

      socket.to(
        payload.componentId
      ).emit(
        "editor:update",
        payload
      );

    }
  );

  socket.on(
    "cursor:update",
    (payload) => {

      socket.to(
        payload.componentId
      ).emit(
        "cursor:update",
        payload
      );

    }
  );

}