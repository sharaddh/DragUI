const rooms = {};

// Per-socket registry so disconnects can be cleaned up even if the client
// never sent presence:leave (was leaking forever before).
const socketRooms = new Map();

function joinRoom(io, socket, componentId, user) {
  const room = rooms[componentId] || (rooms[componentId] = []);
  room.push({ ...user, socketId: socket.id });
  socketRooms.set(socket.id, componentId);
}

function leaveRoom(io, socket) {
  const componentId = socketRooms.get(socket.id);
  if (componentId && rooms[componentId]) {
    rooms[componentId] = rooms[componentId].filter(
      (u) => u.socketId !== socket.id
    );
    io.to(componentId).emit("presence:update", rooms[componentId]);
  }
  socketRooms.delete(socket.id);
}

export function registerPresence(
  io,
  socket
) {

  socket.on(
    "presence:join",
    ({
      componentId,
      user
    }) => {

      if (!componentId || !user?.id) return;

      // Prefer the authenticated identity over the client-supplied one
      const authenticatedId =
        socket.data.userId || socket.data.adminId;
      const safeUser =
        authenticatedId ? { ...user, id: String(authenticatedId) } : user;

      socket.join(componentId);

      joinRoom(io, socket, componentId, safeUser);

      io.to(
        componentId
      ).emit(
        "presence:update",
        rooms[componentId]
      );

    }
  );

  socket.on(
    "presence:leave",
    () => {
      leaveRoom(io, socket);
    }
  );

  socket.on("disconnect", () => {
    leaveRoom(io, socket);
  });

}
