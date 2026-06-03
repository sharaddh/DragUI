export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  DEVELOPER: "developer",
  DESIGNER: "designer",
  VIEWER: "viewer"
};

export const PERMISSIONS = {

  OWNER: [
    "*"
  ],

  ADMIN: [
    "workspace.read",
    "workspace.update",

    "project.create",
    "project.read",
    "project.update",
    "project.delete",

    "component.create",
    "component.read",
    "component.update",
    "component.delete",

    "asset.upload",
    "asset.delete",

    "member.invite",
    "member.remove"
  ],

  DEVELOPER: [
    "project.create",
    "project.read",
    "project.update",

    "component.create",
    "component.read",
    "component.update",

    "asset.upload"
  ],

  DESIGNER: [
    "component.read",
    "component.update",

    "asset.upload",
    "asset.read"
  ],

  VIEWER: [
    "project.read",
    "component.read"
  ]
};