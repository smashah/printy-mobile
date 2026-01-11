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
import type { PullRequestData } from "../types";

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
    position: "relative",
  },
  boardingPassHeader: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
    textAlign: "center",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  prInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 8,
  },
  prNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  statusBadge: {
    backgroundColor: "#2da44e",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    lineHeight: 1.3,
  },
  branchInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  arrowIcon: {
    fontSize: 16,
    marginHorizontal: 8,
    color: "#666",
  },
  branchText: {
    fontSize: 10,
    fontFamily: "Fira Code",
    color: "#24292f",
  },
  diffStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  diffAdded: {
    color: "#2da44e",
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 10,
  },
  diffRemoved: {
    color: "#cf222e",
    fontSize: 10,
    fontWeight: "bold",
  },
  reviewersSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#666",
  },
  reviewersRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
    backgroundColor: "#eee",
  },
  reviewerName: {
    fontSize: 9,
    color: "#444",
  },
  ciStatus: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  ciStatusPassing: {
    backgroundColor: "#dafbe1",
    borderWidth: 1,
    borderColor: "#2da44e",
  },
  ciStatusFailing: {
    backgroundColor: "#ffebe9",
    borderWidth: 1,
    borderColor: "#cf222e",
  },
  ciStatusIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  ciStatusText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  ciStatusTextPassing: {
    color: "#2da44e",
  },
  ciStatusTextFailing: {
    color: "#cf222e",
  },
  qrCode: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 15,
    right: 15,
  },
  barcode: {
    height: 30,
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
    paddingTop: 8,
    marginTop: "auto",
  },
  footerText: {
    fontSize: 8,
    color: "#666",
  },
});

const CheckIcon = () => (
  <Svg viewBox="0 0 16 16" style={styles.ciStatusIcon}>
    <Path
      d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 0-1.06l.72-.72a.75.75 0 0 1 1.06 0L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0l.72.72Z"
      fill="#2da44e"
    />
  </Svg>
);

const XIcon = () => (
  <Svg viewBox="0 0 16 16" style={styles.ciStatusIcon}>
    <Path
      d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
      fill="#cf222e"
    />
  </Svg>
);

export const PullRequestBoardingPass = ({ pr }: { pr: PullRequestData }) => {
  const statusColor = pr.status === "open" ? "#2da44e" : 
                      pr.status === "merged" ? "#8250df" : "#6e7781";
  const ciStatusClass = pr.ciStatus === "passing" ? styles.ciStatusPassing : 
                        pr.ciStatus === "failing" ? styles.ciStatusFailing : 
                        styles.ciStatusPassing;
  const ciStatusTextClass = pr.ciStatus === "passing" ? styles.ciStatusTextPassing : 
                             pr.ciStatus === "failing" ? styles.ciStatusTextFailing : 
                             styles.ciStatusTextPassing;

  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        {pr.qrCodeDataUrl && (
          <Image style={styles.qrCode} src={pr.qrCodeDataUrl} />
        )}

        <View style={styles.boardingPassHeader}>
          <Text style={styles.headerText}>Boarding Pass</Text>
        </View>

        <View style={styles.prInfo}>
          <Text style={styles.prNumber}>#{pr.number}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{pr.status}</Text>
          </View>
        </View>

        <Text style={styles.title}>{pr.title}</Text>

        <View style={styles.branchInfo}>
          <Text style={styles.branchText}>{pr.sourceBranch}</Text>
          <Text style={styles.arrowIcon}>→</Text>
          <Text style={styles.branchText}>{pr.targetBranch}</Text>
        </View>

        <View style={styles.diffStats}>
          <Text style={styles.diffAdded}>+{pr.additions}</Text>
          <Text style={styles.diffRemoved}>-{pr.deletions}</Text>
        </View>

        <View style={styles.reviewersSection}>
          <Text style={styles.sectionTitle}>Reviewers</Text>
          <View style={styles.reviewersRow}>
            {pr.reviewers.slice(0, 3).map((reviewer, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}>
                <Image style={styles.reviewerAvatar} src={reviewer.avatarUrl} />
                <Text style={styles.reviewerName}>{reviewer.login}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.ciStatus, ciStatusClass]}>
          {pr.ciStatus === "passing" ? <CheckIcon /> : pr.ciStatus === "failing" ? <XIcon /> : <CheckIcon />}
          <Text style={[styles.ciStatusText, ciStatusTextClass]}>
            CI {pr.ciStatus === "passing" ? "Passed" : pr.ciStatus === "failing" ? "Failed" : "Pending"}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Author: {pr.author}</Text>
          <Text style={styles.footerText}>PR #{pr.number}</Text>
        </View>
      </Page>
    </Document>
  );
};