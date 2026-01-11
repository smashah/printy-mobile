import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

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
    border: "1pt solid #ddd",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 5,
    color: "#000",
  },
  date: {
    fontSize: 14,
    color: "#666",
    fontWeight: "normal",
  },
  quoteSection: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#6c757d",
  },
  quoteText: {
    fontSize: 11,
    color: "#495057",
    lineHeight: 1.4,
    marginBottom: 4,
  },
  quoteAuthor: {
    fontSize: 9,
    color: "#6c757d",
    textAlign: "right",
    fontWeight: "bold",
  },
  todoSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 3,
    marginRight: 12,
    marginTop: 1,
  },
  todoNumber: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 8,
    fontWeight: "bold",
    color: "#666",
  },
  todoContent: {
    flex: 1,
    minHeight: 30,
  },
  todoLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 8,
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
  motivationalSection: {
    backgroundColor: "#e7f5ff",
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
    border: "1pt solid #74c0fc",
  },
  motivationalText: {
    fontSize: 9,
    color: "#1864ab",
    textAlign: "center",
    fontWeight: "bold",
  },
});

interface TodoData {
  date: string;
  quote?: {
    text: string;
    author: string;
  };
  itemCount?: number;
}

const CheckboxWithNumber = ({ number }: { number: number }) => (
  <View style={styles.checkbox}>
    <View style={styles.todoNumber}>
      <Text>{number}</Text>
    </View>
  </View>
);

const TodoItem = ({ number }: { number: number }) => (
  <View style={styles.todoItem}>
    <CheckboxWithNumber number={number} />
    <View style={styles.todoContent}>
      <View style={styles.todoLine} />
    </View>
  </View>
);

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
];

const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const DailyTodoList = ({ todo }: { todo: TodoData }) => {
  const quote = todo.quote || getRandomQuote();
  const itemCount = todo.itemCount || 10;

  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Todo</Text>
          <Text style={styles.date}>{todo.date}</Text>
        </View>

        {quote && (
          <View style={styles.quoteSection}>
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </View>
        )}

        <View style={styles.todoSection}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          
          {[...Array(itemCount)].map((_, i) => (
            <TodoItem key={i} number={i + 1} />
          ))}
        </View>

        <View style={styles.motivationalSection}>
          <Text style={styles.motivationalText}>
            Make today count! ✨
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Printed on {new Date().toLocaleDateString()} • Daily Todo List
          </Text>
        </View>
      </Page>
    </Document>
  );
};