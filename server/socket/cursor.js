export default function registerCursor(
  io,
  socket
) {

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