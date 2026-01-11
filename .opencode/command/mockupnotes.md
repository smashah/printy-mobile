---
description: Generate feature documentation from mockup HTML and screenshots
---

Generate a feature documentation file for the mockup located in the directory named **'mockups'**.

CRITICAL INSTRUCTION:

If the mockup folder name suggests a feature-specific page (e.g., 'Profile-View-v1'), this mockup likely contains generic UI elements like the app shell, app sidebar, app header, and footer. **DO NOT document these boilerplate features.** Focus solely on the unique, specific elements, content, and interactions that define this particular page/view.

If the mockup folder name suggests boilerplate UI (e.g., 'App-Header-v2'), document **ALL** visible features, content, and interactions within the scope of this mockup, including the component itself.

INPUT FILES:

- **HTML (Structural Content):** Read and analyze the content and structure of the file at **$1**.
- **Screenshot (Visual Reference):** Reference the visual presentation indicated by the file at **$2**.

FEATURES TO DOCUMENT:

1.  **Page Title/View Name:** Identify and state the primary function of this page.
2.  **Key Components:** List the major, unique, non-boilerplate sections, widgets, or panels on the page.
3.  **Specific Interactions:** Detail any unique buttons, forms, dynamic content, or hover/state changes revealed by the HTML and implied by the visual.
4.  **Data/Content:** Note any specific types of data displayed (e.g., user metrics, specific form fields, unique lists).

OUTPUT FORMAT:
Write the complete documentation directly to **$3** using the following Markdown structure. Do not include any text outside of this final file content.

# Mockup Features

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
