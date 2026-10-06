export default function registerCollaboration(
  io,
  socket
) {

  socket.on(
    "editor:join",
    (payload = {}) => {

      const { componentId } = payload;

      if (!componentId) return;

      socket.join(
        componentId
      );

    }
  );

  socket.on(
    "editor:update",
    (payload = {}) => {

      if (!payload?.componentId) return;

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
    (payload = {}) => {

      if (!payload?.componentId) return;

      socket.to(
        payload.componentId
      ).emit(
        "cursor:update",
        payload
      );

    }
  );

}