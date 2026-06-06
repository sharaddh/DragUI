const users = new Map();

export const registerPresence = (
  io,
  socket
) => {

  socket.on(
    "presence:join",
    ({
      projectId,
      user
    }) => {

      users.set(
        socket.id,
        {
          user,
          projectId
        }
      );

      socket.join(
        projectId
      );

      const online =
        Array.from(
          users.values()
        ).filter(
          item =>
            item.projectId ===
            projectId
        );

      io.to(
        projectId
      ).emit(
        "presence:update",
        online
      );

    }
  );

  socket.on(
    "disconnect",
    () => {

      const current =
        users.get(
          socket.id
        );

      if (current) {

        users.delete(
          socket.id
        );

        const online =
          Array.from(
            users.values()
          ).filter(
            item =>
              item.projectId ===
              current.projectId
          );

        io.to(
          current.projectId
        ).emit(
          "presence:update",
          online
        );
      }
    }
  );

}