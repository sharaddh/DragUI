import slugify from "slugify";
import Component from "../models/Component.js";
import ComponentVersion from "../models/ComponentVersion.js";
import extractProps from "../utils/extractProps.js";
import extractDependencies from "../utils/extractDependencies.js";
import { renderThumbnail } from "./renderThumbnail.js";
import { buildManifest } from "./manifestService.js";
import { saveTemplate } from "./templateService.js";

export const createComponent = async (payload, adminId) => {
  const { name, label, category, type, description, code } = payload;

  const slug = slugify(name, { lower: true });
  const props = extractProps(code);
  const dependencies = extractDependencies(code);

  // 1. Save the physical file first
  const template = await saveTemplate({
    type: type || "components", // Fallback just in case
    slug,
    code,
    name // Passed safely for our templateService fix
  });

  // 2. CREATE THE COMPONENT IN MONGODB FIRST
  const component = await Component.create({
    name,
    slug,
    label: label || name,
    category,
    type,
    description,
    template: template.path,
    code,
    props,
    dependencies,
    createdBy: adminId,
    status: "draft"
  });

  // 3. NOW render the thumbnail using the safely created component
  const thumbnail = await renderThumbnail(component);

  if (thumbnail) {
    component.thumbnail = thumbnail.url;
    component.thumbnailPublicId = thumbnail.publicId;
    await component.save(); // Save the newly added thumbnail data
  }

  // 4. Create the initial version history
  await ComponentVersion.create({
    component: component._id,
    version: "1.0.0",
    template: code,
    props,
    dependencies,
    changelog: "Initial version"
  });

  // 5. Build the manifest
  await buildManifest(component);

  return component;
};