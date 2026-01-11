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
    backgroundColor: "#5e6ad2", // Default Linear color
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "capitalize",
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

export const LinearIssueLabel = ({ issue }: { issue: IssueData }) => {
  // Truncate body if too long
  const MAX_LEN = 500;
  const bodyText =
    issue.body?.slice(0, MAX_LEN) +
      (issue.body && issue.body.length > MAX_LEN ? "..." : "") ||
    "No description provided.";

  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.repoName}>{issue.repo || "LINEAR"}</Text>
            <Text style={styles.issueNumber}>{issue.number}</Text>
          </View>
          {SHOW_QR_CODE_TOP_RIGHT_CORNER ? issue.qrCodeDataUrl && (
            <Image
              style={[styles.qrCode, { marginLeft: 10 }]}
              src={issue.qrCodeDataUrl}
            />
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
                    { backgroundColor: "transparent", position: "relative", border: "1" },
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
              {typeof issue.commentsCount === 'number' && (
                <View style={styles.statItem}>
                    <CommentIcon />
                    <Text style={styles.statText}>{issue.commentsCount}</Text>
                </View>
              )}
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
      </Page>
    </Document>
  );
};
