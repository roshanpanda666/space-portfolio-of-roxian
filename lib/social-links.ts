import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "social-links.json");

export interface SocialLinks {
  instagram: string;
}

const DEFAULTS: SocialLinks = {
  instagram: "https://www.instagram.com/roxian_0x",
};

/**
 * Read the current social links from the JSON data file.
 * Falls back to defaults if the file doesn't exist or is malformed.
 */
export function getSocialLinks(): SocialLinks {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SocialLinks>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

/**
 * Write updated social links to the JSON data file.
 */
export function setSocialLinks(updates: Partial<SocialLinks>): SocialLinks {
  const current = getSocialLinks();
  const merged = { ...current, ...updates };

  // Ensure the data directory exists
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  return merged;
}
