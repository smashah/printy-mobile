import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { ReleaseData } from "../types";

Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff",
});

Font.register({
  family: "Fira Code",
  src: "https://cdn.jsdelivr.net/npm/@fontsource/fira-code@4.5.12/files/fira-code-latin-400-normal.woff",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "Inter",
    position: "relative",
    border: "2pt solid #000",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  versionSection: {
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "#f6f8fa",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
  },
  versionNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  commitHash: {
    fontSize: 12,
    fontFamily: "Fira Code",
    color: "#666",
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 11,
    color: "#444",
    marginBottom: 3,
  },
  deployerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  deployerLabel: {
    fontSize: 10,
    color: "#666",
    marginRight: 8,
    textTransform: "uppercase",
  },
  deployerName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  qrSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  qrCode: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  qrLabel: {
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    maxWidth: 80,
  },
  tagCorner: {
    position: "absolute",
    width: 40,
    height: 40,
    backgroundColor: "#000",
  },
  topLeftCorner: {
    top: 0,
    left: 0,
    borderBottomRightRadius: 20,
  },
  topRightCorner: {
    top: 0,
    right: 0,
    borderBottomLeftRadius: 20,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
    borderTopRightRadius: 20,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 20,
  },
  innerCutout: {
    position: "absolute",
    width: 30,
    height: 30,
    backgroundColor: "#fff",
  },
  innerTopLeft: {
    top: 5,
    left: 5,
    borderBottomRightRadius: 15,
  },
  innerTopRight: {
    top: 5,
    right: 5,
    borderBottomLeftRadius: 15,
  },
  innerBottomLeft: {
    bottom: 5,
    left: 5,
    borderTopRightRadius: 15,
  },
  innerBottomRight: {
    bottom: 5,
    right: 5,
    borderTopLeftRadius: 15,
  },
});

export const ReleaseDeploymentTag = ({ release }: { release: ReleaseData }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        <View style={[styles.tagCorner, styles.topLeftCorner]} />
        <View style={[styles.tagCorner, styles.topRightCorner]} />
        <View style={[styles.tagCorner, styles.bottomLeftCorner]} />
        <View style={[styles.tagCorner, styles.bottomRightCorner]} />
        <View style={[styles.innerCutout, styles.innerTopLeft]} />
        <View style={[styles.innerCutout, styles.innerTopRight]} />
        <View style={[styles.innerCutout, styles.innerBottomLeft]} />
        <View style={[styles.innerCutout, styles.innerBottomRight]} />

        <View style={styles.header}>
          <Text style={styles.title}>Release Tag</Text>
          <Text style={styles.subtitle}>Currently Deployed</Text>
        </View>

        <View style={styles.versionSection}>
          <Text style={styles.versionNumber}>{release.version}</Text>
          <Text style={styles.commitHash}>{release.commitHash}</Text>
          <Text style={styles.dateTime}>
            {formatDate(release.deploymentTime)}
          </Text>
        </View>

        <View style={styles.deployerSection}>
          <Text style={styles.deployerLabel}>Deployed by:</Text>
          <Text style={styles.deployerName}>{release.deployer}</Text>
        </View>

        <View style={styles.qrSection}>
          {release.qrCodeDataUrl && (
            <>
              <Image style={styles.qrCode} src={release.qrCodeDataUrl} />
              <Text style={styles.qrLabel}>Scan for release notes</Text>
            </>
          )}
        </View>
      </Page>
    </Document>
  );
};
