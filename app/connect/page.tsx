import { getSocialLinks } from "@/lib/social-links";
import { ConnectPageClient } from "./connect-content";

export default function ConnectPage() {
  const links = getSocialLinks();

  return <ConnectPageClient instagramUrl={links.instagram} />;
}
