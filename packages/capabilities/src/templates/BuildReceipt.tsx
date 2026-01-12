import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";
import type { BuildData } from "../types";

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
    border: "1pt dashed #666",
  },
  header: {
    textAlign: "center",
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
  },
  buildInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  buildInfoItem: {
    flexDirection: "column",
  },
  buildInfoLabel: {
    fontSize: 8,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  buildInfoValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  statusSection: {
    textAlign: "center",
    marginBottom: 15,
  },
  statusBadge: {
    backgroundColor: "#2da44e",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
  },
  statusBadgeFailing: {
    backgroundColor: "#cf222e",
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e1e4e8",
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2da44e",
    borderRadius: 4,
  },
  progressBarFillFailing: {
    backgroundColor: "#cf222e",
  },
  durationSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  clockIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  durationText: {
    fontSize: 11,
    color: "#444",
  },
  stagesSection: {
    marginBottom: 12,
  },
  stagesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#666",
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    padding: 4,
  },
  stageStatusIcon: {
    width: 8,
    height: 8,
    marginRight: 8,
  },
  stageName: {
    fontSize: 9,
    color: "#444",
    flex: 1,
  },
  stageDuration: {
    fontSize: 8,
    color: "#666",
    marginLeft: "auto",
  },
  errorLogSection: {
    backgroundColor: "#ffebe9",
    borderWidth: 1,
    borderColor: "#cf222e",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  errorLogTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#cf222e",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  errorLogContent: {
    fontSize: 7,
    fontFamily: "Fira Code",
    color: "#444",
    whiteSpace: "pre-wrap",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  footerText: {
    fontSize: 8,
    color: "#666",
  },
  receiptDots: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginHorizontal: 10,
  },
  dot: {
    width: 2,
    height: 2,
    backgroundColor: "#ccc",
    borderRadius: 1,
  },
});

const CheckIcon = () => (
  <Svg viewBox="0 0 16 16" style={styles.stageStatusIcon}>
    <Path
      d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 0-1.06l.72-.72a.75.75 0 0 1 1.06 0L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0l.72.72Z"
      fill="#2da44e"
    />
  </Svg>
);

const XIcon = () => (
  <Svg viewBox="0 0 16 16" style={styles.stageStatusIcon}>
    <Path
      d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
      fill="#cf222e"
    />
  </Svg>
);

const ClockIcon = () => (
  <Svg viewBox="0 0 16 16" style={styles.clockIcon}>
    <Path
      d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
      fill="#666"
    />
    <Path
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"
      fill="#666"
    />
  </Svg>
);

const ReceiptDots = () => (
  <View style={styles.receiptDots}>
    {[...Array(20)].map((_, i) => (
      <View key={i} style={styles.dot} />
    ))}
  </View>
);

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
};

export const BuildReceipt = ({ build }: { build: BuildData }) => {
  const isSuccess = build.status === "success";
  const statusBadgeClass = isSuccess
    ? styles.statusBadge
    : styles.statusBadgeFailing;
  const progressFillClass = isSuccess
    ? styles.progressBarFill
    : styles.progressBarFillFailing;
  const progressWidth = isSuccess ? 100 : 75;

  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Build Receipt</Text>
          <Text style={styles.subtitle}>CI Pipeline Summary</Text>
        </View>

        <View style={styles.buildInfo}>
          <View style={styles.buildInfoItem}>
            <Text style={styles.buildInfoLabel}>Build ID</Text>
            <Text style={styles.buildInfoValue}>#{build.buildId}</Text>
          </View>
          <View style={styles.buildInfoItem}>
            <Text style={styles.buildInfoLabel}>Time</Text>
            <Text style={styles.buildInfoValue}>
              {new Date(build.startTime).toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, statusBadgeClass]}>
            <Text style={styles.statusText}>
              {build.status === "success"
                ? "Success"
                : build.status === "failure"
                  ? "Failed"
                  : "Running"}
            </Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              progressFillClass,
              { width: `${progressWidth}%` },
            ]}
          />
        </View>

        <View style={styles.durationSection}>
          <ClockIcon />
          <Text style={styles.durationText}>
            Duration: {formatDuration(build.duration)}
          </Text>
        </View>

        <View style={styles.stagesSection}>
          <Text style={styles.stagesTitle}>Pipeline Stages</Text>
          {build.stages.slice(0, 5).map((stage, i) => (
            <View key={i} style={styles.stageRow}>
              {stage.status === "success" ? (
                <CheckIcon />
              ) : stage.status === "failure" ? (
                <XIcon />
              ) : (
                <View style={styles.stageStatusIcon} />
              )}
              <Text style={styles.stageName}>{stage.name}</Text>
              {stage.duration && (
                <Text style={styles.stageDuration}>
                  {formatDuration(stage.duration)}
                </Text>
              )}
            </View>
          ))}
        </View>

        {!isSuccess && build.errorLog && (
          <View style={styles.errorLogSection}>
            <Text style={styles.errorLogTitle}>Error Log</Text>
            <Text style={styles.errorLogContent}>
              {build.errorLog.slice(0, 200)}
              {build.errorLog.length > 200 && "..."}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Printed: {new Date().toLocaleDateString()}
          </Text>
          <ReceiptDots />
          <Text style={styles.footerText}>Build #{build.buildId}</Text>
        </View>
      </Page>
    </Document>
  );
};
