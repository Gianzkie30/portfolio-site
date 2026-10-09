export const SERVICES = [
  { id: "landing", name: "Landing Page", desc: "A focused single page that converts visitors." },
  { id: "business", name: "Business Website", desc: "Multi-page site for your company or brand." },
  { id: "portfolio", name: "Portfolio Website", desc: "Showcase your work, skills and story." },
  { id: "ecommerce", name: "E-commerce Store", desc: "Sell products online with a smooth checkout." },
  { id: "webapp", name: "Web Application", desc: "Custom dashboards, tools and portals." },
  { id: "redesign", name: "Redesign & Maintenance", desc: "Refresh or keep an existing site healthy." },
] as const;

export const STATUSES = ["Pending", "In Review", "Approved", "In Progress", "Completed", "Rejected"] as const;
export type Status = (typeof STATUSES)[number];

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
