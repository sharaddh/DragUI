export default function registerBuilderEvents(
  io,
  socket
) {

  /*
  ===========================
  JOIN PROJECT
  ===========================
  */

  socket.on(
    "project:join",
    ({
      projectId,
      user
    }) => {

      socket.join(
        projectId
      );

      socket.to(
        projectId
      ).emit(
        "presence:user-joined",
        {
          user
        }
      );

    }
  );

  /*
  ===========================
  COMPONENT ADD
  ===========================
  */

  socket.on(
    "builder:add",
    (payload) => {

      socket.to(
        payload.projectId
      ).emit(
        "builder:add",
        payload
      );

    }
  );

  /*
  ===========================
  COMPONENT REMOVE
  ===========================
  */

  socket.on(
    "builder:remove",
    (payload) => {

      socket.to(
        payload.projectId
      ).emit(
        "builder:remove",
        payload
      );

    }
  );

  /*
  ===========================
  PROPERTY CHANGE
  ===========================
  */

  socket.on(
    "builder:update",
    (payload) => {

      socket.to(
        payload.projectId
      ).emit(
        "builder:update",
        payload
      );

    }
  );

  /*
  ===========================
  TREE CHANGE
  ===========================
  */

  socket.on(
    "builder:tree",
    (payload) => {

      socket.to(
        payload.projectId
      ).emit(
        "builder:tree",
        payload
      );

    }
  );

}