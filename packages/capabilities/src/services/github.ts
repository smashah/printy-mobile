import type { IssueData } from "../types";
import { createDitheredBackground, ditherImage } from "../utils";

export async function fetchGithubIssue(url: string): Promise<IssueData> {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/;
  const match = url.match(regex);

  if (!match) {
    throw new Error("Invalid GitHub issue URL");
  }

  const [, owner, repo, issueNumber] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    "User-Agent": "printy-mobile",
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl, { headers });

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub issue: ${res.statusText}`);
  }

  const data = (await res.json()) as Record<string, unknown>;

  const user = data.user as Record<string, unknown> | undefined;
  const ditheredAvatar = user?.avatar_url
    ? await ditherImage(user.avatar_url as string, 60, 60)
    : undefined;

  const statusColor = data.state === "open" ? "#2da44e" : "#8250df";
  const statusDitheredBg = await createDitheredBackground(statusColor, 100, 50);

  const rawLabels = (data.labels as Array<Record<string, unknown>>) || [];
  const labels = await Promise.all(
    rawLabels.map(async (l) => ({
      name: l.name as string,
      color: l.color as string,
      ditheredBackground: await createDitheredBackground(
        `#${l.color}`,
        100,
        50,
      ),
    })),
  );

  const rawAssignees = (data.assignees as Array<Record<string, unknown>>) || [];
  const assignees = rawAssignees.map((a) => ({
    login: a.login as string,
    avatarUrl: a.avatar_url as string,
  }));

  const reactions = data.reactions as Record<string, number> | undefined;

  return {
    title: data.title as string,
    number: data.number as number,
    status: data.state as string,
    statusDitheredBackground: statusDitheredBg,
    author: user?.login as string | undefined,
    authorAvatarUrl: ditheredAvatar,
    repo: `${owner}/${repo}`,
    url: url,
    createdAt: new Date(data.created_at as string).toLocaleDateString(),
    labels,
    assignees,
    commentsCount: data.comments as number,
    reactions: reactions
      ? {
          total_count: reactions.total_count ?? 0,
          "+1": reactions["+1"] ?? 0,
          "-1": reactions["-1"] ?? 0,
          laugh: reactions.laugh ?? 0,
          hooray: reactions.hooray ?? 0,
          confused: reactions.confused ?? 0,
          heart: reactions.heart ?? 0,
          rocket: reactions.rocket ?? 0,
          eyes: reactions.eyes ?? 0,
        }
      : undefined,
    body: data.body as string | undefined,
  };
}
