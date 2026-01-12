---
TASK: Generate a feature documentation file for the mockup located in the directory named **'mockups'**.

CRITICAL INSTRUCTION:
${CRITICAL_INSTRUCTION} 
# (This variable will contain one of the two blocks below, depending on the folder name.)

# Block 1: For feature-specific mockups (e.g., 'Profile-View-v1')
# CRITICAL INSTRUCTION: This mockup likely contains generic UI elements like the app shell, app sidebar, app header, and footer. 
# **DO NOT document these boilerplate features.** Focus solely on the unique, specific elements, content, and interactions that define this particular page/view.

# Block 2: For mockups specifically focused on boilerplate UI (e.g., 'App-Header-v2')
# CRITICAL INSTRUCTION: The folder name suggests this mockup is specifically about a common UI component (e.g., App Header, Footer). 
# Document **ALL** visible features, content, and interactions within the scope of this mockup, including the component itself.

---

INPUT FILES:

- **HTML (Structural Content):** Read and analyze the content and structure of the file at **${HTML_PATH}**.
- **Screenshot (Visual Reference):** Reference the visual presentation indicated by the file at **${SCREENSHOT_PATH}**.

FEATURES TO DOCUMENT:

1.  **Page Title/View Name:** Identify and state the primary function of this page.
2.  **Key Components:** List the major, unique, non-boilerplate sections, widgets, or panels on the page.
3.  **Specific Interactions:** Detail any unique buttons, forms, dynamic content, or hover/state changes revealed by the HTML and implied by the visual.
4.  **Data/Content:** Note any specific types of data displayed (e.g., user metrics, specific form fields, unique lists).

OUTPUT FORMAT:
Write the complete documentation directly to **${OUTPUT_PATH}** using the following Markdown structure. Do not include any text outside of this final file content.

# ${FOLDER_NAME} Mockup Features

## Overview

[A concise one-to-two-sentence summary of the page's primary function and focus.]

## Key Features & Components

### 1. [Unique Feature/Component Title, e.g., 'User Profile Card']

- Detail of what's shown or done in this area.
- Another detail about its function or content.

### 2. [Another Unique Feature/Component Title]

- Detail.
- Detail.

## Data Points

- List the key data elements displayed (e.g., User's full name, Account status badge, Editable phone number field).

## Interactions & Flows

- Describe unique button actions, link clicks, or form submissions (e.g., 'Edit Bio' button toggles a textarea view).
- Note any conditional logic or dynamic behavior visible in the mockup.
