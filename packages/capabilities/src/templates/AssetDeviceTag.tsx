import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { AssetData } from "../types";

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
    padding: 15,
    fontFamily: "Inter",
    position: "relative",
    border: "2pt solid #000",
  },
  header: {
    textAlign: "center",
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 8,
  },
  propertyLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    color: "#000",
  },
  propertySubtitle: {
    fontSize: 8,
    color: "#666",
    fontStyle: "italic",
  },
  deviceInfo: {
    marginBottom: 15,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  deviceModel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  assetSection: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  assetIdRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  assetIdLabel: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#666",
    width: 60,
  },
  assetIdValue: {
    fontSize: 14,
    fontFamily: "Fira Code",
    color: "#000",
    flex: 1,
    fontWeight: "bold",
  },
  barcodeContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  barcode: {
    height: 40,
    width: "100%",
  },
  contactSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#666",
    marginBottom: 6,
  },
  contactInfo: {
    backgroundColor: "#fff3cd",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  contactText: {
    fontSize: 9,
    color: "#856404",
    lineHeight: 1.3,
  },
  returnInstructions: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.3,
    fontStyle: "italic",
  },
  warningBorder: {
    borderWidth: 2,
    borderColor: "#dc3545",
    borderRadius: 4,
    padding: 2,
  },
  qrSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  qrCode: {
    width: 50,
    height: 50,
  },
  qrLabel: {
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    flex: 1,
    marginLeft: 10,
  },
  companyInfo: {
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
  tagDate: {
    fontSize: 8,
    color: "#666",
  },
  holePunch: {
    position: "absolute",
    top: 10,
    left: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
});

export const AssetDeviceTag = ({ asset }: { asset: AssetData }) => {
  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        <View style={styles.holePunch} />

        <View style={styles.header}>
          <Text style={styles.propertyLabel}>
            Property of {asset.companyName}
          </Text>
          <Text style={styles.propertySubtitle}>
            Company Asset - Do Not Remove
          </Text>
        </View>

        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{asset.deviceName}</Text>
          <Text style={styles.deviceModel}>{asset.deviceModel}</Text>
        </View>

        <View style={styles.assetSection}>
          <View style={styles.assetIdRow}>
            <Text style={styles.assetIdLabel}>Asset ID:</Text>
            <Text style={styles.assetIdValue}>{asset.assetId}</Text>
          </View>

          {asset.barcodeDataUrl && (
            <View style={styles.barcodeContainer}>
              <Image style={styles.barcode} src={asset.barcodeDataUrl} />
            </View>
          )}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Return Instructions</Text>
          <View style={[styles.warningBorder, styles.contactInfo]}>
            <Text style={styles.contactText}>
              If found, please return to {asset.contactName}
            </Text>
            <Text style={styles.contactText}>Email: {asset.contactEmail}</Text>
            {asset.contactPhone && (
              <Text style={styles.contactText}>
                Phone: {asset.contactPhone}
              </Text>
            )}
          </View>
          <Text style={styles.returnInstructions}>
            This device is company property. Unauthorized removal is prohibited.
          </Text>
        </View>

        <View style={styles.qrSection}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {asset.qrCodeDataUrl && (
              <Image style={styles.qrCode} src={asset.qrCodeDataUrl} />
            )}
            <Text style={styles.qrLabel}>Scan for asset information</Text>
          </View>

          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{asset.companyName}</Text>
            <Text style={styles.tagDate}>
              Tagged: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
