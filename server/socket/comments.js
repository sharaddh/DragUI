// Relays comment activity to everyone else in a component room.
export default function registerComments(
  io,
  socket
) {

  socket.on(
    "comment:join",
    ({ componentId }) => {
      if (componentId) {
        socket.join(`comments:${componentId}`);
      }
    }
  );

  socket.on(
    "comment:new",
    (payload) => {
      if (!payload?.componentId) return;
      socket
        .to(`comments:${payload.componentId}`)
        .emit("comment:new", payload);
    }
  );

}
