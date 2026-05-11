import dotenv from "dotenv";

dotenv.config();

export function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is missing in environment variables");
  }

  return token;
}