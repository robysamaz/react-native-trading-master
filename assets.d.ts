// Static asset module declarations so TypeScript can resolve image imports
// (e.g. `import logo from "@/assets/images/logo.png"`). Metro resolves these
// to numeric asset IDs at runtime; the type is intentionally loose.
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.webp";
declare module "*.svg";
