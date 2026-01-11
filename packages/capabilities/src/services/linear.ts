import type { IssueData } from "../types";
import { createDitheredBackground, ditherImage } from "../utils";

export async function fetchLinearIssue(url: string): Promise<IssueData> {
  const idMatch = url.match(/([A-Z]+-\d+)/);
  const id = idMatch ? idMatch[1] : "UNKNOWN";

  const urlParts = url.split("/");
  const lastPart = urlParts[urlParts.length - 1] || "issue";
  const titleGuess = lastPart.replace(/-/g, " ");

  const apiKey = process.env.LINEAR_API_KEY;
  if (apiKey) {
    try {
      const queryByRef = `
        query Issues($filter: IssueFilter) {
          issues(filter: $filter) {
            nodes {
              title
              number
              identifier
              description
              state {
                name
                color
              }
              creator {
                name
                avatarUrl
              }
              assignee {
                name
                avatarUrl
              }
              labels {
                nodes {
                  name
                  color
                }
              }
              createdAt
              url
            }
          }
        }
      `;

      const response = await fetch("https://api.linear.app/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          query: queryByRef,
          variables: {
            filter: {
              identifier: {
                eq: id,
              },
            },
          },
        }),
      });

      const result = (await response.json()) as Record<string, unknown>;
      const data = result.data as Record<string, unknown> | undefined;
      const issues = data?.issues as Record<string, unknown> | undefined;
      const nodes = issues?.nodes as Array<Record<string, unknown>> | undefined;
      const issue = nodes?.[0];

      if (issue) {
        const labelsData = issue.labels as Record<string, unknown> | undefined;
        const labelNodes = (labelsData?.nodes as Array<Record<string, unknown>>) || [];
        const labels = await Promise.all(
          labelNodes.map(async (l) => {
            const color = l.color as string | undefined;
            const colorHex = color?.startsWith("#") ? color : `#${color || "cccccc"}`;
            return {
              name: l.name as string,
              color: color || "cccccc",
              ditheredBackground: await createDitheredBackground(colorHex, 100, 50),
            };
          }),
        );

        const state = issue.state as Record<string, unknown> | undefined;
        const statusColor = (state?.color as string) || "#5e6ad2";
        const statusColorHex = statusColor.startsWith("#") ? statusColor : `#${statusColor}`;
        const statusDitheredBg = await createDitheredBackground(statusColorHex, 100, 50);

        const creator = issue.creator as Record<string, unknown> | undefined;
        const authorAvatar = creator?.avatarUrl
          ? await ditherImage(creator.avatarUrl as string, 60, 60)
          : undefined;

        const assignee = issue.assignee as Record<string, unknown> | undefined;
        const assigneeAvatar = assignee?.avatarUrl
          ? await ditherImage(assignee.avatarUrl as string, 60, 60)
          : undefined;

        const assignees = assignee
          ? [{ login: assignee.name as string, avatarUrl: assigneeAvatar || "" }]
          : [];

        return {
          title: String(issue.title || "Linear Issue"),
          number: String(issue.identifier || "UNKNOWN"),
          status: String(state?.name || ""),
          statusDitheredBackground: statusDitheredBg,
          author: String(creator?.name || ""),
          authorAvatarUrl: authorAvatar,
          repo: "Linear",
          url: String(issue.url || url),
          createdAt: new Date(issue.createdAt as string).toLocaleDateString(),
          labels,
          body: issue.description as string | undefined,
          assignees,
          commentsCount: 0,
        };
      }
    } catch (e) {
      console.error("Failed to fetch from Linear API, falling back to URL parsing", e);
    }
  }

  return {
    title: String(titleGuess || "Linear Issue"),
    number: String(id),
    status: "Unknown",
    repo: "Linear",
    url: String(url),
    createdAt: new Date().toLocaleDateString(),
  };
}
