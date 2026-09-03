export async function imageSearchService(file: File | null) {
  // Placeholder abstraction for future AI/image-recognition integration.
  // Returns mocked search results based on filename heuristics.
  if (!file) return { results: [] };

  const name = file.name.toLowerCase();
  const matches = [];
  if (name.includes("solar")) matches.push("Industrial Solar Inverter");
  if (name.includes("excavator") || name.includes("dig")) matches.push("Hydraulic Excavator 320");
  if (name.includes("filter")) matches.push("Water Filtration Unit Model A");

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 700));

  return { results: matches.length ? matches : ["Edge Gateway X1", "Hydraulic Excavator 320"] };
}

export default imageSearchService;
