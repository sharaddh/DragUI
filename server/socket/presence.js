const rooms = {};

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

      socket.join(
        componentId
      );

      if (
        !rooms[
          componentId
        ]
      ) {

        rooms[
          componentId
        ] = [];

      }

      const exists =
        rooms[
          componentId
        ].find(
          (u) =>
            u.id ===
            user.id
        );

      if (!exists) {

        rooms[
          componentId
        ].push(
          user
        );

      }

      io.to(
        componentId
      ).emit(
        "presence:update",
        rooms[
          componentId
        ]
      );

    }
  );

  socket.on(
    "presence:leave",
    ({
      componentId,
      user
    }) => {

      if (
        rooms[
          componentId
        ]
      ) {

        rooms[
          componentId
        ] =
          rooms[
            componentId
          ].filter(
            (u) =>
              u.id !==
              user.id
          );

      }

      io.to(
        componentId
      ).emit(
        "presence:update",
        rooms[
          componentId
        ]
      );

    }
  );

}