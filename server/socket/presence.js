const rooms = {};

export default function registerPresence(
  io,
  socket
) {

  socket.on(
    "presence:join",
    ({
      componentId,
      user
    }) => {

      if (
        !rooms[
          componentId
        ]
      ) {

        rooms[
          componentId
        ] = [];

      }

      rooms[
        componentId
      ].push(user);

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