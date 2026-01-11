import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { WifiData } from "../types";

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
    border: "2pt solid #333",
    borderRadius: 8,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  wifiIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  wifiIcon: {
    fontSize: 40,
    color: "#333",
  },
  qrSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  qrCode: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 8,
  },
  networkInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#666",
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  passwordContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "dashed",
  },
  passwordText: {
    fontSize: 16,
    fontFamily: "Fira Code",
    color: "#000",
    textAlign: "center",
    letterSpacing: 2,
  },
  instructions: {
    textAlign: "center",
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  instructionText: {
    fontSize: 9,
    color: "#666",
    marginBottom: 5,
    lineHeight: 1.4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: "#999",
  },
  cornerDecoration: {
    position: "absolute",
    width: 20,
    height: 20,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: "#333",
    borderLeftColor: "#333",
  },
  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopColor: "#333",
    borderRightColor: "#333",
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomColor: "#333",
    borderLeftColor: "#333",
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: "#333",
    borderRightColor: "#333",
  },
});

const WifiIcon = () => (
  <View style={styles.wifiIconContainer}>
    <Text style={styles.wifiIcon}>📶</Text>
  </View>
);

export const WifiAccessCard = ({ wifi }: { wifi: WifiData }) => {
  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        <View style={[styles.cornerDecoration, styles.topLeft]} />
        <View style={[styles.cornerDecoration, styles.topRight]} />
        <View style={[styles.cornerDecoration, styles.bottomLeft]} />
        <View style={[styles.cornerDecoration, styles.bottomRight]} />

        <View style={styles.header}>
          <Text style={styles.title}>Wi-Fi Access</Text>
          <Text style={styles.subtitle}>Guest Network</Text>
        </View>

        <WifiIcon />

        <View style={styles.qrSection}>
          <Image style={styles.qrCode} src={wifi.qrCodeDataUrl} />
        </View>

        <View style={styles.networkInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network:</Text>
            <Text style={styles.infoValue}>{wifi.ssid}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Security:</Text>
            <Text style={styles.infoValue}>{wifi.security}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Password:</Text>
            <View style={styles.passwordContainer}>
              <Text style={styles.passwordText}>{wifi.password}</Text>
            </View>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Scan QR code to connect automatically
          </Text>
          <Text style={styles.instructionText}>
            Or select network manually and enter password
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated: {new Date().toLocaleDateString()}</Text>
          <Text style={styles.footerText}>Guest Access</Text>
        </View>
      </Page>
    </Document>
  );
};