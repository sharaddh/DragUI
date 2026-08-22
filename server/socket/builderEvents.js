import RealtimeSession from "../models/RealtimeSession.js";

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
    async ({
      projectId,
      user
    }) => {

      socket.join(
        projectId
      );

      // Persist the session so collaborationController.getActiveUsers has data
      try {
        await RealtimeSession.create({
          project: projectId,
          user: socket.data.userId || undefined,
          socketId: socket.id,
        });
      } catch {
        // non-fatal - project ids may not be ObjectIds
      }

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

  socket.on("disconnect", async () => {
    try {
      await RealtimeSession.deleteMany({ socketId: socket.id });
    } catch {
      // non-fatal
    }
  });

}