"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../lib/utils";

/**
 * Generic Code Highlight component with fallback for when prism-react-renderer is not available
 * To enable syntax highlighting, install: `npm install prism-react-renderer`
 *
 * Features:
 * - Syntax highlighting (if prism-react-renderer is installed)
 * - Dark theme optimized
 * - Scrollable for long code blocks
 * - Copy to clipboard functionality
 * - Responsive design
 */
export interface CodeHighlightProps {
  /** The code string to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?:
    | "tsx"
    | "typescript"
    | "javascript"
    | "json"
    | "css"
    | "html"
    | "sql"
    | "bash";
  /** Additional wrapper props */
  wrapperProps?: React.ComponentProps<"div">;
  /** Show copy button */
  showCopy?: boolean;
  /** Maximum height for scrolling */
  maxHeight?: string;
}

export const CodeHighlight: React.FC<CodeHighlightProps> = ({
  code,
  language = "tsx",
  wrapperProps,
  showCopy = true,
  maxHeight = "75vh",
}) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    // Add custom scrollbar styles
    const styleElement = document.createElement("style");
    styleElement.id = "code-highlight-styles";

    // Only add styles once
    if (!document.getElementById("code-highlight-styles")) {
      styleElement.appendChild(
        document.createTextNode(`
          .code-highlight-container::-webkit-scrollbar {
            -webkit-appearance: none;
            height: 8px;
            width: 8px;
          }
          .code-highlight-container::-webkit-scrollbar-thumb {
            background-color: #6b7280;
            border-radius: 4px;
          }
          .code-highlight-container::-webkit-scrollbar-track {
            background-color: #1f2937;
          }
          .code-highlight-container::-webkit-scrollbar-corner {
            background-color: #1f2937;
          }
        `),
      );
      document.head.appendChild(styleElement);
    }
  }, []);

  const copyToClipboard = async () => {
    if (navigator.clipboard && code) {
      try {
        await navigator.clipboard.writeText(code);
        // You could add a toast notification here
        console.log("Code copied to clipboard");
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  // Try to use prism-react-renderer if available, otherwise fallback
  let HighlightComponent: React.ReactNode;

  try {
    // Dynamic import attempt for prism-react-renderer
    // This will be tree-shaken if not available
    const PrismHighlight = React.lazy(() =>
      import("prism-react-renderer").then((module) => ({
        default: ({ code, language }: { code: string; language: string }) => {
          const { Highlight, themes } = module;
          return (
            <Highlight
              theme={themes.vsDark}
              code={code}
              language={language as any}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  ref={codeRef}
                  className={cn(className, "p-4 m-0 w-full box-border text-sm")}
                  style={style}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line, key: i })}>
                      <span className="inline-block w-8 text-right mr-4 text-gray-500 select-none">
                        {i + 1}
                      </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          );
        },
      })),
    );

    HighlightComponent = (
      <React.Suspense fallback={<FallbackCode code={code} />}>
        <PrismHighlight code={code} language={language} />
      </React.Suspense>
    );
  } catch {
    // Fallback if prism-react-renderer is not available
    HighlightComponent = <FallbackCode code={code} />;
  }

  return (
    <div
      className={cn(
        "relative group",
        "border border-gray-700 rounded-lg overflow-hidden",
        "bg-gray-900 dark:bg-gray-900",
      )}
      {...wrapperProps}
    >
      {/* Header with language and copy button */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
          {language}
        </span>
        {showCopy && (
          <button
            onClick={copyToClipboard}
            className={cn(
              "text-xs text-gray-400 hover:text-gray-200",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "px-2 py-1 rounded bg-gray-700 hover:bg-gray-600",
            )}
          >
            Copy
          </button>
        )}
      </div>

      {/* Code content */}
      <div
        className="code-highlight-container overflow-auto"
        style={{ maxHeight }}
      >
        {HighlightComponent}
      </div>
    </div>
  );
};

// Fallback component when prism-react-renderer is not available
const FallbackCode: React.FC<{ code: string }> = ({ code }) => (
  <pre
    className={cn(
      "p-4 m-0 w-full box-border text-sm",
      "text-gray-200 bg-gray-900",
      "whitespace-pre-wrap break-words",
      "font-mono leading-relaxed",
    )}
  >
    {code.split("\n").map((line, i) => (
      <div key={i}>
        <span className="inline-block w-8 text-right mr-4 text-gray-500 select-none">
          {i + 1}
        </span>
        {line}
      </div>
    ))}
  </pre>
);

CodeHighlight.displayName = "CodeHighlight";
