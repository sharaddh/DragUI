import slugify from "slugify";

import Workspace from "../models/Workspace.js";

import {
  ROLES,
} from "../constants/roles.js";

export const createWorkspace =
async (
  data,
  userId
) => {

  const slug =
    slugify(
      data.name,
      {
        lower: true,
        strict: true,
      }
    );

  const exists =
    await Workspace.findOne({
      slug,
    });

  if (exists) {
    throw new Error(
      "Workspace already exists"
    );
  }

  const workspace =
    await Workspace.create({
      name: data.name,

      slug,

      description:
        data.description,

      owner: userId,

      members: [
        {
          user: userId,

          role:
            ROLES.OWNER,
        },
      ],
    });

  return workspace;
};

export const getWorkspace =
async (
  workspaceId
) => {

  return Workspace.findById(
    workspaceId
  )
    .populate(
      "owner",
      "username email avatar"
    )
    .populate(
      "members.user",
      "username email avatar"
    );

};

export const getUserWorkspaces =
async (
  userId
) => {

  return Workspace.find({
    "members.user":
      userId,
  })
    .sort({
      createdAt: -1,
    });

};

export const addMember =
async (
  workspaceId,
  userId,
  role
) => {

  // Never admit a member directly as owner
  if (!ASSIGNABLE_ROLES.has(role)) {
    throw new Error(
      "Invalid role"
    );
  }

  const workspace =
    await Workspace.findById(
      workspaceId
    );

  if (!workspace) {
    throw new Error(
      "Workspace not found"
    );
  }

  const exists =
    workspace.members.find(
      (m) =>
        m.user.toString() ===
        userId.toString()
    );

  if (exists) {
    throw new Error(
      "User already member"
    );
  }

  workspace.members.push({
    user: userId,
    role,
  });

  await workspace.save();

  return workspace;
};

export const removeMember =
async (
  workspaceId,
  userId
) => {

  const workspace =
    await Workspace.findById(
      workspaceId
    );

  if (!workspace) {
    throw new Error(
      "Workspace not found"
    );
  }

  workspace.members =
    workspace.members.filter(
      (m) =>
        m.user.toString() !==
        userId.toString()
    );

  await workspace.save();

  return workspace;
};

const ASSIGNABLE_ROLES = new Set([
  ROLES.ADMIN,
  ROLES.DEVELOPER,
  ROLES.DESIGNER,
  ROLES.VIEWER,
]);

export const updateMemberRole =
async (
  workspaceId,
  userId,
  role
) => {

  // Ownership transfers are not supported through this path -
  // granting OWNER here would be a privilege-escalation vector.
  if (!ASSIGNABLE_ROLES.has(role)) {
    throw new Error(
      "Invalid role"
    );
  }

  const workspace =
    await Workspace.findById(
      workspaceId
    );

  if (!workspace) {
    throw new Error(
      "Workspace not found"
    );
  }

  const member =
    workspace.members.find(
      (m) =>
        m.user.toString() ===
        userId.toString()
    );

  if (!member) {
    throw new Error(
      "Member not found"
    );
  }

  member.role = role;

  await workspace.save();

  return workspace;
};