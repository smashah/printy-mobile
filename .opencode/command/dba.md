---
description: Analyze PRD and infer database schema with entities, fields, and relationships
---

Act as a Database Architect. Analyze the entirety of the Product Requirements Document (PRD) located at **'$1'**. Your goal is to infer the core data models and relationships required to support the functionality described in the document.

INPUT FILE:

- **PRD Content:** Read and analyze the complete textual content of the file at **$1**.

ANALYSIS FOCUS (Look for):

1.  **Core Entities (Tables):** Identify the main 'things' or 'objects' the system interacts with (e.g., Users, Products, Projects, Comments, Invoices).
2.  **Attributes (Fields):** For each entity, determine the necessary properties, including fields for identity (ID), essential content (Name, Description), timestamps (created_at, updated_at), and status/state tracking (e.g., status, role, type).
3.  **Relationships:** Identify how entities connect (One-to-One, One-to-Many, Many-to-Many). This will determine where Foreign Keys (FKs) or intermediate join tables are needed.
4.  **Constraints:** Note requirements for uniqueness, indexing, and mandatory fields implied by the PRD's features (e.g., 'A user must have a unique email', 'An order always requires a customer ID').

OUTPUT FORMAT:
Write the complete database schema outline directly to **$2** using the following Markdown structure. Do not include any text outside of this final file content.

# Database Schema Outline: Derived from PRD

## 1. Core Entities (Tables)

Identify the main tables and provide a brief description of their purpose.

| Entity Name (Plural) | Primary Function / Purpose                                   |
| :------------------- | :----------------------------------------------------------- |
| Users                | Stores authentication and profile data for all system users. |
| [New Entity]         | [Description]                                                |
| [New Entity]         | [Description]                                                |

## 2. Entity Details & Fields

For each core entity identified above, define its essential fields, inferred data types, and constraints.

### Entity: Users

| Field Name | Data Type (Inferred) | Notes (PK, FK, Required, Index) |
| :--------- | :------------------- | :------------------------------ |
| user_id    | UUID                 | Primary Key (PK)                |
| email      | VARCHAR(255)         | Required, Unique, Index         |
| username   | VARCHAR(100)         | Required                        |
| created_at | TIMESTAMP            | Required                        |
| last_login | TIMESTAMP            | Nullable                        |

### Entity: [Entity Name 2, e.g., Products]

| Field Name   | Data Type (Inferred) | Notes (PK, FK, Required, Index) |
| :----------- | :------------------- | :------------------------------ |
| [field_name] | [Data Type]          | [Notes]                         |
| [field_name] | [Data Type]          | [Notes]                         |

## 3. Relationships Summary

Summarize the key connections between the entities.

- **[Entity A] to [Entity B]:** [Type of Relationship] (e.g., One-to-Many)
  - **Mechanism:** [Entity A].id is referenced by the Foreign Key `[entity_a]_id` on the [Entity B] table.
- **[Entity C] to [Entity D]:** [Type of Relationship] (e.g., Many-to-Many)
  - **Mechanism:** Requires a separate join table, e.g., `EntityC_EntityD_Junction`.

---
