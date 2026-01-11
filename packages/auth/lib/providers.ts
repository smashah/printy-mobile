import { SiDiscord, SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";

/**
 * SET AUTH PROVIDERS HERE
 */
export const defaultProviders = [
  {
    name: "google",
    provider: "google",
    icon: SiGoogle,
    label: "Sign in with Google",
  },
  {
    name: "github",
    provider: "github",
    icon: SiGithub,
    label: "Sign in with GitHub",
  },
  {
    name: "discord",
    provider: "discord",
    icon: SiDiscord,
    label: "Sign in with Discord",
  },
];
