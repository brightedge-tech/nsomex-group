export const divisions = [
  {
    number: "01",
    name: "NSOMEX Technology",
    slug: "technology",
    summary:
      "Technology, cloud infrastructure, cybersecurity, software, and digital transformation.",
    focus: ["Cloud & Infrastructure", "Cybersecurity", "Software & Data"],
  },
  {
    number: "02",
    name: "NSOMEX Engineering",
    slug: "engineering",
    summary:
      "Engineering, construction, infrastructure, and project delivery capabilities.",
    focus: ["Construction", "Civil & Structural", "Project Management"],
  },
  {
    number: "03",
    name: "NSOMEX Renewable Energy",
    slug: "renewable-energy",
    summary:
      "Renewable energy solutions, solar power, energy storage, and power systems.",
    focus: ["Solar Energy", "Energy Storage", "Power Systems"],
  },
  {
    number: "04",
    name: "NSOMEX Global Business",
    slug: "global-business",
    summary:
      "International trade, sourcing, logistics, market development, and partnerships.",
    focus: ["International Trade", "Global Sourcing", "Strategic Partnerships"],
  },
] as const;

export const primaryNavigation = [
  { label: "About", href: "/about" },
  { label: "Divisions", href: "/divisions" },
  { label: "Projects", href: "/projects" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;
