import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";

Font.register({
  family: "Fira Code",
  src: "https://cdn.jsdelivr.net/npm/@fontsource/fira-code@4.5.12/files/fira-code-latin-400-normal.woff",
});
Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff",
});

const PAGE_WIDTH = 288;
const PAGE_HEIGHT = 432;
const CONTENT_MARGIN = 10;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    padding: 0,
    backgroundColor: '#fff',
  },
  borderWrapper: {
    margin: 8,
    border: "2pt solid #000",
    height: "96%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    padding: CONTENT_MARGIN,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  metadata: {
    fontSize: 8,
    fontFamily: "Fira Code",
    color: "#000",
    marginBottom: 1,
  },
  qrCode: {
    width: 60,
    height: 60,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 4,
    backgroundColor: "#000",
    color: "#fff",
    padding: "2 4",
    alignSelf: "flex-start",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "flex-start",
  },
  ingredient: {
    fontSize: 9,
    fontFamily: "Fira Code",
    flex: 1,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  stepIndex: {
    fontSize: 9,
    fontFamily: "Fira Code",
    fontWeight: "bold",
    width: 18,
    marginRight: 2,
  },
  step: {
    fontSize: 9,
    lineHeight: 1.3,
    flex: 1,
    textAlign: "left",
  },
  image: {
    marginBottom: 8,
    height: 90,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: "#000",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 4,
    paddingHorizontal: 10,
    paddingBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    fontFamily: "Fira Code",
  }
});

export interface RecipeData {
  title: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  cookware: { name: string }[];
  steps: string[];
  metadata?: Record<string, string>;
  image?: string;
}

export const Recipe = ({ recipe }: { recipe: RecipeData }) => {
  const sourceKeys = ['source', 'url', 'link'];
  const sourceKey = Object.keys(recipe.metadata || {}).find(k => sourceKeys.includes(k.toLowerCase()));
  const sourceUrl = sourceKey && recipe.metadata ? recipe.metadata[sourceKey] : null;

  const displayMetadata = Object.entries(recipe.metadata || {})
    .filter(([k]) => k !== sourceKey);

  const MAX_CONTENT_HEIGHT = 260;
  const stepFontSize = 9;
  const stepLineHeight = 1.3;
  const stepMargin = 5;
  const charsPerLine = 36;

  const stepChunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentHeight = 0;

  recipe.steps.forEach((step) => {
    const lines = Math.ceil(step.length / charsPerLine) || 1;
    const stepHeight = (lines * stepFontSize * stepLineHeight) + stepMargin;
    
    if (currentHeight + stepHeight > MAX_CONTENT_HEIGHT && currentChunk.length > 0) {
      stepChunks.push(currentChunk);
      currentChunk = [];
      currentHeight = 0;
    }
    
    currentChunk.push(step);
    currentHeight += stepHeight;
  });
  
  if (currentChunk.length > 0) {
    stepChunks.push(currentChunk);
  }
  
  if (stepChunks.length === 0) stepChunks.push([]);

  const chunkStartIndices: number[] = [];
  let runningTotal = 0;
  for (const chunk of stepChunks) {
    chunkStartIndices.push(runningTotal);
    runningTotal += chunk.length;
  }

  const hasImage = !!recipe.image;
  const ingLimit = hasImage ? 12 : 18;

  return (
    <Document>
      <Page size={[PAGE_WIDTH, PAGE_HEIGHT]} style={styles.page}>
        <View style={styles.borderWrapper}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>{recipe.title}</Text>
                {displayMetadata.map(([key, val]) => (
                  <Text key={key} style={styles.metadata}>{key.toUpperCase()}: {val}</Text>
                ))}
              </View>
              {sourceUrl && (
                <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(sourceUrl)}`}
                  style={styles.qrCode}
                />
              )}
            </View>

            {recipe.image && (
              <Image src={recipe.image} style={styles.image} />
            )}

            <View>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {recipe.ingredients.slice(0, ingLimit).map((ing, i) => (
                <View key={i} style={styles.row}>
                   <Text style={styles.ingredient}>{ing.quantity} {ing.unit} {ing.name}</Text>
                </View>
              ))}
              {recipe.ingredients.length > ingLimit && (
                <Text style={{ fontSize: 8, fontStyle: 'italic', marginTop: 4 }}>
                  ...and {recipe.ingredients.length - ingLimit} more
                </Text>
              )}
            </View>

            {recipe.cookware.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Cookware</Text>
                 <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                   {recipe.cookware.slice(0, 6).map((c, i) => (
                     <Text key={i} style={[styles.ingredient, { marginRight: 8, marginBottom: 4, flexGrow: 0, flexShrink: 0, flexBasis: 'auto' }]}>• {c.name}</Text>
                   ))}
                 </View>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
             <Text style={styles.footerText}>PRINTY • RECIPE</Text>
             <Text style={styles.footerText}>1 / {1 + stepChunks.length}</Text>
          </View>
        </View>
      </Page>
      
      {stepChunks.map((chunk, pageIndex) => {
        const startIndex = chunkStartIndices[pageIndex] ?? 0;
        const endIndex = startIndex + chunk.length;
        
        return (
          <Page key={pageIndex} size={[PAGE_WIDTH, PAGE_HEIGHT]} style={styles.page}>
             <View style={styles.borderWrapper}>
               <View style={styles.content}>
                 <View style={styles.header}>
                    <Text style={styles.title}>{recipe.title}</Text>
                 </View>
                 <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
                   {startIndex + 1 === endIndex ? `Step ${startIndex + 1}` : `Steps (${startIndex + 1}-${endIndex})`}
                 </Text>
                 <View>
                   {chunk.map((step, i) => (
                     <View key={i} style={[styles.stepContainer, { marginBottom: stepMargin }]}>
                       <Text style={[styles.stepIndex, { fontSize: stepFontSize }]}>
                         {startIndex + i + 1}.
                       </Text>
                       <Text style={[styles.step, { fontSize: stepFontSize, lineHeight: stepLineHeight }]}>{step}</Text>
                     </View>
                   ))}
                 </View>
               </View>
               
               <View style={styles.footer}>
                  <Text style={styles.footerText}>PRINTY • RECIPE</Text>
                  <Text style={styles.footerText}>{pageIndex + 2} / {1 + stepChunks.length}</Text>
               </View>
             </View>
          </Page>
        );
      })}
    </Document>
  );
};
