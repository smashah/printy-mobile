import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Fira Code",
  src: "https://cdn.jsdelivr.net/npm/@fontsource/fira-code@4.5.12/files/fira-code-latin-400-normal.woff",
});
Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff",
});

const PAGE_WIDTH = 288; // 4 inches * 72 dpi
const PAGE_HEIGHT = 432; // 6 inches * 72 dpi
const MARGIN = 15;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    padding: MARGIN,
    backgroundColor: "#fff",
  },
  border: {
    border: "3pt dashed #000",
    height: "100%",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  imageContainer: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    border: "1pt solid #ccc",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  infoSection: {
    width: "100%",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 5,
  },
  colorsSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  colorBubble: {
    width: 20,
    height: 20,
    borderRadius: 10,
    border: "1pt solid #000",
  },
  footer: {
    marginTop: 5,
    borderTop: "1pt solid #000",
    width: "100%",
    paddingTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 6,
    fontFamily: "Fira Code",
    color: "#666",
  },
});

export interface ColoringPageData {
  title: string;
  imageUrl: string;
  description?: string;
  suggestedColors: string[];
}

export const ColoringPage = ({ data }: { data: ColoringPageData }) => {
  return (
    <Document>
      <Page size={[PAGE_WIDTH, PAGE_HEIGHT]} style={styles.page}>
        <View style={styles.border}>
          <View style={styles.header}>
            <Text style={styles.title}>{data.title}</Text>
          </View>

          <View style={styles.imageContainer}>
            {/* Use a high contrast filter if possible, but for now just the image */}
            <Image src={data.imageUrl} style={styles.image} />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              {data.description || "Color this in!"}
            </Text>

            <View style={{ alignItems: "center", marginTop: 8 }}>
              <Text
                style={{ fontSize: 8, marginBottom: 4, fontWeight: "bold" }}
              >
                Suggested Colors:
              </Text>
              <View style={styles.colorsSection}>
                {data.suggestedColors.map((color, i) => (
                  <View
                    key={i}
                    style={{ alignItems: "center", marginRight: 5 }}
                  >
                    {/*<View style={[styles.colorBubble, { backgroundColor: color }]} />*/}
                    <Text style={{ fontSize: 6, marginTop: 2 }}>{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>PRINTY • COLORING</Text>
            <Text style={styles.footerText}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
