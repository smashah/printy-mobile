import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";

const SHOW_QR_CODE_TOP_RIGHT_CORNER = true;
// Register Fonts
Font.register({
  family: "Fira Code",
  src: "https://cdn.jsdelivr.net/npm/@fontsource/fira-code@4.5.12/files/fira-code-latin-400-normal.woff",
});

Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 15,
    fontFamily: "Inter",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    paddingBottom: 10,
  },
  repoName: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  issueNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  statusBadge: {
    backgroundColor: "#2da44e", // Green for open usually, but static here
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "capitalize",
    // border: "1px",
    borderRadius: 4,
    padding: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    lineHeight: 1.3,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    backgroundColor: "#eee",
  },
  authorName: {
    fontSize: 10,
    color: "#444",
  },
  dateText: {
    fontSize: 10,
    color: "#888",
    marginLeft: "auto",
  },
  bodyContainer: {
    backgroundColor: "#f6f8fa",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#000000",
  },
  bodyText: {
    fontSize: 9,
    fontFamily: "Fira Code",
    color: "#24292f",
    lineHeight: 1.4,
  },
  footer: {
    marginTop: "auto",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  labelChip: {
    backgroundColor: "#ddf4ff",
    color: "#0969da",
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
    paddingTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  statText: {
    fontSize: 9,
    color: "#57606a",
  },
  assigneeStack: {
    flexDirection: "row",
  },
  assigneeAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -4,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#ddd",
  },
  qrCode: {
    width: 60,
    height: 60,
  },
  watermark: {
    position: "absolute",
    bottom: 5,
    right: 5,
    fontSize: 6,
    color: "#ccc",
  },
});

interface IssueData {
  title: string;
  number: string | number;
  status?: string;
  statusDitheredBackground?: string;
  author?: string;
  repo?: string;
  url: string;
  createdAt?: string;
  labels?: { name: string; color: string; ditheredBackground?: string }[];
  assignees?: { login: string; avatarUrl: string }[];
  commentsCount?: number;
  reactions?: {
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  body?: string;
  authorAvatarUrl?: string;
  qrCodeDataUrl?: string;
}

const CommentIcon = () => (
  <Svg viewBox="0 0 16 16" style={styles.statIcon}>
    <Path
      d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.75.75 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
      fill="#57606a"
    />
  </Svg>
);

const ReactionIcon = () => (
  <Svg
    width="16"
    height="16"
    viewBox="0 0 122.88 122.88"
    style={styles.statIcon}
  >
    <Path
      d="M45.54,2.1A61.48,61.48,0,1,1,8.25,30.74,61.26,61.26,0,0,1,45.54,2.1ZM30.61,70.3a38,38,0,0,0,8.34,8,40.39,40.39,0,0,0,23.58,7.1A38.05,38.05,0,0,0,85.3,77.68a33.56,33.56,0,0,0,7.08-7.42.22.22,0,0,1,.3-.06L95,72.49a.21.21,0,0,1,0,.27A43.47,43.47,0,0,1,81.7,87.08a35.7,35.7,0,0,1-19,6,36.82,36.82,0,0,1-19.53-5.25A47.5,47.5,0,0,1,27.87,72.9a.23.23,0,0,1,0-.27l2.38-2.36a.22.22,0,0,1,.3,0l0,0ZM76.23,33.89c4.06,0,7.35,4.77,7.35,10.65s-3.29,10.64-7.35,10.64-7.35-4.77-7.35-10.64,3.29-10.65,7.35-10.65Zm-29.58,0c4.06,0,7.35,4.77,7.35,10.65s-3.29,10.64-7.35,10.64S39.3,50.41,39.3,44.54s3.29-10.65,7.35-10.65Zm42.1-19.75A54.64,54.64,0,1,0,114.18,47.3,54.46,54.46,0,0,0,88.75,14.14Z"
      fill="#000000"
    />
  </Svg>
);

const ThumbsUpIcon = () => (
  <Svg viewBox="0 0 16 16" style={styles.statIcon}>
    <Path
      d="M8 12.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM9 3.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 9 3.5Z"
      fill="#57606a"
    />
    <Path
      d="M9 14.5a.75.75 0 0 1-.75.75H2.75a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v6.25Zm4-12a1.75 1.75 0 0 0-1.75 1.75v2.5a.75.75 0 0 0 .75 1.75h1.5a.25.25 0 0 1 .25.25v6.5a.25.25 0 0 1-.25.25h-1.5a.75.75 0 0 0-.75 1.75v.5a1.75 1.75 0 0 0 1.75 1.75h.5c.966 0 1.75-.784 1.75-1.75v-11c0-.966-.784-1.75-1.75-1.75h-.5Z"
      fill="#57606a"
    />
  </Svg>
);

export const GithubIssueLabel = ({ issue }: { issue: IssueData }) => {
  // Truncate body if too long
  const MAX_LEN = 500;
  const bodyText =
    issue.body?.slice(0, MAX_LEN) +
      (issue.body && issue.body.length > MAX_LEN ? "..." : "") ||
    "No description provided.";

  const statusColor = issue.status === "open" ? "#2da44e" : "#8250df"; // Green for open, purple for merged/closed

  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.repoName}>{issue.repo}</Text>
            <Text style={styles.issueNumber}>#{issue.number}</Text>
          </View>
          {SHOW_QR_CODE_TOP_RIGHT_CORNER ? (
            issue.qrCodeDataUrl && (
              <Image
                style={[styles.qrCode, { marginLeft: 10 }]}
                src={issue.qrCodeDataUrl}
              />
            )
          ) : (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: "black", position: "relative", border: "1" },
              ]}
            >
              <View
                style={{
                  position: "relative",
                  zIndex: 100,
                  backgroundColor: "rgba(255, 255, 255, 0.01)",
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: issue.statusDitheredBackground ? "#FFF" : "#000" },
                  ]}
                >
                  {issue.status}
                </Text>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.title}>{issue.title}</Text>

        <View style={styles.authorRow}>
          {issue.authorAvatarUrl && (
            <Image style={styles.avatar} src={issue.authorAvatarUrl} />
          )}
          <Text style={styles.authorName}>{issue.author}</Text>
          <Text style={styles.dateText}>{issue.createdAt}</Text>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>{bodyText}</Text>
        </View>

        <View style={styles.footer}>
          {issue.labels && issue.labels.length > 0 && (
            <View style={styles.metaRow}>
              {issue.labels.map((label, i) => (
                <View
                  key={i}
                  style={[
                    styles.labelChip,
                    {
                      backgroundColor: "transparent",
                      position: "relative",
                      border: "1",
                    },
                  ]}
                >
                  <View
                    style={{
                      position: "relative",
                      zIndex: 100,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      paddingHorizontal: 4,
                      paddingVertical: 1,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 8,
                        zIndex: 100,
                        fontWeight: "bold",
                      }}
                    >
                      {label.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.statRow}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.statItem}>
                <CommentIcon />
                <Text style={styles.statText}>{issue.commentsCount || 0}</Text>
              </View>
              <View style={styles.statItem}>
                {(issue.reactions?.["+1"] || 0) > 0 ? (
                  <ReactionIcon />
                ) : (
                  <ReactionIcon />
                )}
                <Text
                  style={{
                    ...styles.statText,
                    marginLeft: 8,
                  }}
                >
                  {(issue.reactions?.["+1"] || 0) > 0
                    ? issue.reactions?.["+1"]
                    : issue.reactions?.total_count || 0}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {issue.assignees && issue.assignees.length > 0 && (
                <View style={styles.assigneeStack}>
                  {issue.assignees.map((assignee, i) => (
                    <Image
                      key={i}
                      style={[
                        styles.assigneeAvatar,
                        { marginLeft: i === 0 ? 0 : -6 },
                      ]}
                      src={assignee.avatarUrl}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
        {/*<Text style={styles.watermark}>printy</Text>*/}
      </Page>
    </Document>
  );
};
