#!/usr/bin/env bun

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

interface ProjectConfig {
  projectName: string;
  projectSlug: string;
  domain: string;
  cloudflareAccountId?: string;
  cloudflareZoneId?: string;
  projectSlogan: string;
  projectDescription: string;
  portPrefix: number;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function isValidSlug(slug: string): boolean {
  // Slug must be lowercase, use kebab-case, and be a valid npm package name
  // - Start with a letter or underscore
  // - Contain only lowercase letters, numbers, hyphens, and underscores
  // - No dots, spaces, uppercase letters, or other special characters
  const slugRegex = /^[a-z][a-z0-9-]*$/;

  if (!slugRegex.test(slug)) {
    return false;
  }

  // Additional checks
  if (slug.includes("..")) return false; // No consecutive dots
  if (slug.startsWith("-") || slug.endsWith("-")) return false; // No leading/trailing hyphens
  if (slug.includes("--")) return false; // No consecutive hyphens
  if (slug.length < 2 || slug.length > 214) return false; // npm package name length limits

  return true;
}

async function collectProjectInfo(): Promise<ProjectConfig> {
  console.log("🚀 SmashStack Template Project Initializer\n");

  const projectName = await question(
    "Enter project name (e.g., Hypermile Club): ",
  );
  if (!projectName || projectName.trim().length === 0) {
    console.log("❌ Project name is required");
    process.exit(1);
  }

  const projectSlug = await question(
    "Enter project slug (e.g., hypermile-club): ",
  );
  if (!projectSlug || projectSlug.trim().length === 0) {
    console.log("❌ Project slug is required");
    process.exit(1);
  }

  const trimmedSlug = projectSlug.trim();
  if (!isValidSlug(trimmedSlug)) {
    console.log("❌ Invalid project slug format!");
    console.log("   Requirements:");
    console.log("   - Must be lowercase");
    console.log("   - Use kebab-case (e.g., my-project)");
    console.log("   - Start with a letter");
    console.log("   - Only letters, numbers, and hyphens");
    console.log("   - No dots, spaces, uppercase, or special characters");
    console.log("   - No consecutive or trailing/leading hyphens");
    console.log("   - Length between 2-214 characters");

    // Provide a suggestion if possible
    const suggested = trimmedSlug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/^[^a-z]+/, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 214);

    if (suggested && isValidSlug(suggested)) {
      console.log(`\n💡 Suggested slug: ${suggested}`);
    }

    process.exit(1);
  }

  const domain = await question("Enter main domain (e.g., hypermile.club): ");
  if (!domain || domain.trim().length === 0) {
    console.log("❌ Domain is required");
    process.exit(1);
  }

  const projectSlogan = await question(
    "Enter project slogan/motto (e.g., Track your fuel efficiency): ",
  );
  if (!projectSlogan || projectSlogan.trim().length === 0) {
    console.log("❌ Project slogan is required");
    process.exit(1);
  }

  const projectDescription = await question(
    "Enter project description for SEO (e.g., Track and analyze your fuel efficiency with detailed insights): ",
  );
  if (!projectDescription || projectDescription.trim().length === 0) {
    console.log("❌ Project description is required");
    process.exit(1);
  }

  const portPrefixInput = await question(
    "Enter dev port prefix (default 8920): ",
  );
  let portPrefix = 8920;
  if (portPrefixInput.trim() !== "") {
    const parsed = Number.parseInt(portPrefixInput.trim(), 10);
    if (Number.isNaN(parsed) || parsed < 1000 || parsed > 65_000) {
      console.log(
        "❌ Invalid port prefix. Please enter a number between 1000 and 65000.",
      );
      process.exit(1);
    }
    portPrefix = parsed;
  }

  console.log("\n📋 Optional Cloudflare Configuration:");
  const cloudflareAccountId = await question(
    "Cloudflare Account ID (optional, press Enter to skip): ",
  );
  const cloudflareZoneId = await question(
    "Cloudflare Zone ID (optional, press Enter to skip): ",
  );

  return {
    projectName: projectName.trim(),
    projectSlug: trimmedSlug,
    domain: domain.trim(),
    cloudflareAccountId: cloudflareAccountId.trim() || undefined,
    cloudflareZoneId: cloudflareZoneId.trim() || undefined,
    projectSlogan: projectSlogan.trim(),
    projectDescription: projectDescription.trim(),
    portPrefix,
  };
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .git, and other common directories
      if (
        !["node_modules", ".git", ".next", "dist", "build", ".turbo"].includes(
          file,
        )
      ) {
        getAllFiles(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function replaceInFile(filePath: string, config: ProjectConfig): void {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Replace patterns with appropriate suffixes/prefixes
  const replacements = [
    // Basic replacements
    { pattern: /Printy Mobile/g, replacement: config.projectName },
    {
      pattern: /Print labels anywhere with your mobile device/g,
      replacement: config.projectSlogan,
    },
    {
      pattern:
        /Mobile-first thermal printing application for generating labels, tickets, and documents on the go/g,
      replacement: config.projectDescription,
    },
    { pattern: /"printy-mobile"/g, replacement: `"${config.projectSlug}"` },
    { pattern: /yourdomain\.com/g, replacement: config.domain },
    {
      pattern: /portPrefix = 8930/g,
      replacement: `portPrefix = ${config.portPrefix}`,
    },
    {
      pattern: /export const apiPort = 8930/g,
      replacement: `export const apiPort = ${config.portPrefix}`,
    },
    {
      pattern: /export const backofficePort = portPrefix \+ 1/g,
      replacement: `export const backofficePort = ${config.portPrefix + 1}`,
    },
    {
      pattern: /export const webappPort = portPrefix \+ 2/g,
      replacement: `export const webappPort = ${config.portPrefix + 2}`,
    },
    {
      pattern: /export const dbPort = portPrefix \+ 3/g,
      replacement: `export const dbPort = ${config.portPrefix + 3}`,
    },
    {
      pattern: /export const devApiUrl = `http:\/\/localhost:\$\{apiPort\}`/g,
      replacement: `export const devApiUrl = \`http://localhost:${config.portPrefix}\``,
    },
    {
      pattern:
        /export const devWebappUrl = `http:\/\/localhost:\$\{webappPort\}`/g,
      replacement: `export const devWebappUrl = \`http://localhost:${config.portPrefix + 2}\``,
    },
    {
      pattern:
        /export const devBackofficeUrl = `http:\/\/localhost:\$\{backofficePort\}`/g,
      replacement: `export const devBackofficeUrl = \`http://localhost:${config.portPrefix + 1}\``,
    },
    {
      pattern:
        /export const cloudflareAccountId: string \| undefined = undefined/g,
      replacement: config.cloudflareAccountId
        ? `export const cloudflareAccountId: string | undefined = "${config.cloudflareAccountId}"`
        : `export const cloudflareAccountId: string | undefined = undefined`,
    },
    {
      pattern:
        /export const cloudflareZoneId: string \| undefined = undefined/g,
      replacement: config.cloudflareZoneId
        ? `export const cloudflareZoneId: string | undefined = "${config.cloudflareZoneId}"`
        : `export const cloudflareZoneId: string | undefined = undefined`,
    },
    {
      pattern: /PRINTY_MOBILE/g,
      replacement: config.projectName.replace(/\s+/g, "_").toUpperCase(),
    },
    { pattern: /printy-mobile/g, replacement: config.projectSlug },
    { pattern: /printy-mobile/g, replacement: config.projectSlug },
    { pattern: /printy-mobile/g, replacement: config.projectSlug },

    // Domain replacements
    { pattern: /\[DOMAIN_NAME\]/g, replacement: config.domain },
    { pattern: /api\.\[DOMAIN_NAME\]/g, replacement: `api.${config.domain}` },
    { pattern: /yourdomain\.com/g, replacement: config.domain },
    {
      pattern: /https:\/\/yourdomain\.com/g,
      replacement: `https://${config.domain}`,
    },
    {
      pattern: /yourapp-webapp\.yourname\.workers\.dev/g,
      replacement: `${config.projectSlug}-webapp.${config.projectSlug.split("-")[0]}.workers.dev`,
    },

    // Cloudflare replacements (only if provided)
    ...(config.cloudflareAccountId
      ? [
          {
            pattern: /# account_id = "YOUR_ACCOUNT_ID"/g,
            replacement: `account_id = "${config.cloudflareAccountId}"`,
          },
          {
            pattern: /YOUR_ACCOUNT_ID/g,
            replacement: config.cloudflareAccountId,
          },
        ]
      : []),

    ...(config.cloudflareZoneId
      ? [{ pattern: /YOUR_ZONE_ID/g, replacement: config.cloudflareZoneId }]
      : []),

    // Package.json @printy-mobile namespace replacements
    // This replaces @printy-mobile with @{projectSlug} in all contexts:
    // - @printy-mobile/ui -> @{projectSlug}/ui
    // - @printy-mobile/api -> @{projectSlug}/api
    // - @printy-mobile/db -> @{projectSlug}/db
    // - etc.
    { pattern: /@printy-mobile/g, replacement: `@${config.projectSlug}` },

    // Database ID placeholder
    { pattern: /YOUR_DATABASE_ID/g, replacement: "YOUR_DATABASE_ID" }, // Keep as placeholder for manual setup

    // API host replacements in auth and API files
    { pattern: /api\.yourdomain\.com/g, replacement: `api.${config.domain}` },
    {
      pattern: /https:\/\/api\.yourdomain\.com/g,
      replacement: `https://api.${config.domain}`,
    },

    // Refine.dev social images (backoffice)
    {
      pattern: /https:\/\/refine\.dev\/img\/refine_social\.png/g,
      replacement: `https://${config.domain}/img/social.png`,
    },
    { pattern: /demo@refine\.dev/g, replacement: `demo@${config.domain}` },

    // Hardcoded domains in backoffice utils
    { pattern: /synthetiko\.com/g, replacement: config.domain },
    {
      pattern: /dashboard\.synthetiko\.com/g,
      replacement: `dashboard.${config.domain}`,
    },
    { pattern: /api\.synthetiko\.com/g, replacement: `api.${config.domain}` },

    // Specific patterns with suffixes
    { pattern: /printy-mobile-api/g, replacement: `${config.projectSlug}-api` },
    {
      pattern: /printy-mobile-webapp/g,
      replacement: `${config.projectSlug}-webapp`,
    },
    { pattern: /printy-mobile-db/g, replacement: `${config.projectSlug}-db` },
    {
      pattern: /printy-mobile-d1-database/g,
      replacement: `${config.projectSlug}-d1-database`,
    },
    {
      pattern: /printy-mobile-backoffice/g,
      replacement: `${config.projectSlug}-backoffice`,
    },
  ];

  for (const { pattern, replacement } of replacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }

  // Targeted dev port updates
  const apiPort = config.portPrefix;
  const backofficePort = config.portPrefix + 1;
  const webappPort = config.portPrefix + 2;
  const dbPort = config.portPrefix + 3;

  const apiPkgPath = path.join("apps", "api", "package.json");
  const apiWranglerPath = path.join("apps", "api", "wrangler.toml");
  const backofficePkgPath = path.join("apps", "backoffice", "package.json");
  const webappPkgPath = path.join("apps", "webapp", "package.json");
  const dbPkgPath = path.join("packages", "db", "package.json");
  const webappAuthPath = path.join("apps", "webapp", "src", "lib", "auth.ts");
  const webappApiUtilPath = path.join(
    "apps",
    "webapp",
    "src",
    "utils",
    "api.ts",
  );
  const configIndexPath = path.join("packages", "config", "src", "index.ts");
  const nativeAppJsonPath = path.join("apps", "native", "app.json");

  if (filePath.endsWith(apiPkgPath)) {
    const updated = content.replace(/(--port\s+)\d+/g, `$1${apiPort}`);
    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  if (filePath.endsWith(apiWranglerPath)) {
    const updated = content.replace(/(port\s*=\s*)\d+/g, `$1${apiPort}`);
    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  if (filePath.endsWith(backofficePkgPath)) {
    const updated = content.replace(/(--port\s+)\d+/g, `$1${backofficePort}`);
    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  if (filePath.endsWith(webappPkgPath)) {
    const updated = content.replace(/(--port\s+)\d+/g, `$1${webappPort}`);
    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  if (filePath.endsWith(dbPkgPath)) {
    const updated = content.replace(/(--port\s+)\d+/g, `$1${dbPort}`);
    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  // Replace hardcoded API port in webapp TypeScript files
  if (filePath.endsWith(webappAuthPath)) {
    const updated = content.replace(/localhost:7800/g, `localhost:${apiPort}`);
    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  if (filePath.endsWith(webappApiUtilPath)) {
    const updated = content.replace(/localhost:7800/g, `localhost:${apiPort}`);
    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  // Replace API port default in config package
  if (filePath.endsWith(configIndexPath)) {
    const updated = content
      .replace(
        /(API_PORT:\s*z\.coerce\.number\(\)\.default\()\d+(\))/g,
        `$1${apiPort}$2`,
      )
      .replace(/localhost:7800/g, `localhost:${apiPort}`);
    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  // Replace native app.json placeholders
  if (filePath.endsWith(nativeAppJsonPath)) {
    let updated = content
      // Update expo name from @printy-mobile/native to @{projectSlug}/native
      .replace(
        /"name":\s*"@printy-mobile\/native"/g,
        `"name": "@${config.projectSlug}/native"`,
      )
      // Update slug from repo-native to {projectSlug}-native
      .replace(
        /"slug":\s*"repo-native"/g,
        `"slug": "${config.projectSlug}-native"`,
      )
      // Update scheme from reponative to {projectSlug}native (no dash for deep linking)
      .replace(
        /"scheme":\s*"reponative"/g,
        `"scheme": "${config.projectSlug.replace(/-/g, "")}native"`,
      )
      // Update android package from com.anonymous.reponative to com.{projectSlug}.native
      .replace(
        /"package":\s*"com\.anonymous\.reponative"/g,
        `"package": "com.${config.projectSlug.replace(/-/g, "")}.native"`,
      );

    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  // Replace globals.ts placeholders with calculated values
  const globalsPath = path.join("packages", "config", "src", "globals.ts");
  if (filePath.endsWith(globalsPath)) {
    let updated = content
      // Replace project metadata
      .replace(
        /export const projectName = "Printy Mobile"/g,
        `export const projectName = "${config.projectName}"`,
      )
      .replace(
        /export const projectSlug = "printy-mobile"/g,
        `export const projectSlug = "${config.projectSlug}"`,
      )
      .replace(
        /export const projectSlogan = "Print labels anywhere with your mobile device"/g,
        `export const projectSlogan = "${config.projectSlogan}"`,
      )
      .replace(
        /export const projectDescription = "Mobile-first thermal printing application for generating labels, tickets, and documents on the go"/g,
        `export const projectDescription = "${config.projectDescription}"`,
      )
      // Replace domain values (must come before domain-dependent replacements)
      .replace(
        /export const domain = "yourdomain\.com"/g,
        `export const domain = "${config.domain}"`,
      )
      // Replace port prefix and calculated ports
      .replace(
        /export const portPrefix = 8930/g,
        `export const portPrefix = ${config.portPrefix}`,
      )
      .replace(
        /export const apiPort = 8930/g,
        `export const apiPort = ${config.portPrefix}`,
      )
      .replace(
        /export const backofficePort = portPrefix \+ 1/g,
        `export const backofficePort = ${config.portPrefix + 1}`,
      )
      .replace(
        /export const webappPort = portPrefix \+ 2/g,
        `export const webappPort = ${config.portPrefix + 2}`,
      )
      .replace(
        /export const dbPort = portPrefix \+ 3/g,
        `export const dbPort = ${config.portPrefix + 3}`,
      )
      // Replace dev URLs (hardcode values for reliability)
      .replace(
        /export const devApiUrl = `http:\/\/localhost:\$\{apiPort\}`/g,
        `export const devApiUrl = "http://localhost:${config.portPrefix}"`,
      )
      .replace(
        /export const devWebappUrl = `http:\/\/localhost:\$\{webappPort\}`/g,
        `export const devWebappUrl = "http://localhost:${config.portPrefix + 2}"`,
      )
      .replace(
        /export const devBackofficeUrl = `http:\/\/localhost:\$\{backofficePort\}`/g,
        `export const devBackofficeUrl = "http://localhost:${config.portPrefix + 1}"`,
      )
      // Replace Cloudflare IDs (conditional)
      .replace(
        /export const cloudflareAccountId: string \| undefined = undefined/g,
        config.cloudflareAccountId
          ? `export const cloudflareAccountId: string | undefined = "${config.cloudflareAccountId}"`
          : `export const cloudflareAccountId: string | undefined = undefined`,
      )
      .replace(
        /export const cloudflareZoneId: string \| undefined = undefined/g,
        config.cloudflareZoneId
          ? `export const cloudflareZoneId: string | undefined = "${config.cloudflareZoneId}"`
          : `export const cloudflareZoneId: string | undefined = undefined`,
      );

    if (updated !== content) {
      content = updated;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`);
  }
}

async function getConfigFromFile(): Promise<ProjectConfig | null> {
  const configPath = path.join("repo.conf");
  if (!fs.existsSync(configPath)) {
    return null;
  }

  console.log("Found repo.conf. Reading configuration...");
  try {
    const content = fs.readFileSync(configPath, "utf8");
    const configData = JSON.parse(content);

    // Basic validation
    if (
      !(
        configData.projectName &&
        configData.projectSlug &&
        configData.domain &&
        configData.projectSlogan &&
        configData.projectDescription &&
        configData.portPrefix
      )
    ) {
      console.log("❌ repo.conf is missing required fields.");
      return null;
    }

    const trimmedSlug = String(configData.projectSlug).trim();

    // Validate slug format
    if (!isValidSlug(trimmedSlug)) {
      console.log("❌ Invalid project slug format in repo.conf!");
      console.log("   Requirements:");
      console.log("   - Must be lowercase");
      console.log("   - Use kebab-case (e.g., my-project)");
      console.log("   - Start with a letter");
      console.log("   - Only letters, numbers, and hyphens");
      console.log("   - No dots, spaces, uppercase, or special characters");
      console.log("   - No consecutive or trailing/leading hyphens");
      console.log("   - Length between 2-214 characters");
      return null;
    }

    return {
      projectName: String(configData.projectName).trim(),
      projectSlug: trimmedSlug,
      domain: String(configData.domain).trim(),
      projectSlogan: String(configData.projectSlogan).trim(),
      projectDescription: String(configData.projectDescription).trim(),
      portPrefix: Number(configData.portPrefix),
      cloudflareAccountId: configData.cloudflareAccountId
        ? String(configData.cloudflareAccountId).trim()
        : undefined,
      cloudflareZoneId: configData.cloudflareZoneId
        ? String(configData.cloudflareZoneId).trim()
        : undefined,
    };
  } catch (error) {
    console.log(`❌ Error reading or parsing repo.conf: ${error}`);
    return null;
  }
}

function saveConfigToFile(config: ProjectConfig): void {
  const configPath = path.join("repo.conf");
  const configData = {
    projectName: config.projectName,
    projectSlug: config.projectSlug,
    domain: config.domain,
    projectSlogan: config.projectSlogan,
    projectDescription: config.projectDescription,
    portPrefix: config.portPrefix,
    ...(config.cloudflareAccountId && {
      cloudflareAccountId: config.cloudflareAccountId,
    }),
    ...(config.cloudflareZoneId && {
      cloudflareZoneId: config.cloudflareZoneId,
    }),
  };

  try {
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), "utf8");
    console.log(`✓ Saved configuration to repo.conf`);
  } catch (error) {
    console.log(`❌ Error saving repo.conf: ${error}`);
  }
}

function printSummary(config: ProjectConfig) {
  console.log(`   Project Name: ${config.projectName}`);
  console.log(`   Project Slug: ${config.projectSlug}`);
  console.log(`   Domain: ${config.domain}`);
  console.log(`   API Domain: api.${config.domain}`);
  console.log(`   Project Slogan: ${config.projectSlogan}`);
  console.log(`   Project Description: ${config.projectDescription}`);
  console.log(
    `   Dev Ports: API=${config.portPrefix}, Backoffice=${config.portPrefix + 1}, Webapp=${config.portPrefix + 2}, DB=${config.portPrefix + 3}`,
  );
  if (config.cloudflareAccountId) {
    console.log(`   Cloudflare Account ID: ${config.cloudflareAccountId}`);
  }
  if (config.cloudflareZoneId) {
    console.log(`   Cloudflare Zone ID: ${config.cloudflareZoneId}`);
  }
  console.log();
}

async function main() {
  let config: ProjectConfig | undefined;

  const fileConfig = await getConfigFromFile();

  if (fileConfig) {
    console.log("\n📋 Configuration Summary from repo.conf:");
    printSummary(fileConfig);

    const confirmFile = await question(
      "Proceed with this configuration? (y/N, or any other key for interactive mode): ",
    );
    if (
      confirmFile.toLowerCase() === "y" ||
      confirmFile.toLowerCase() === "yes"
    ) {
      config = fileConfig;
    }
  }

  if (!config) {
    if (fileConfig) {
      console.log("\n Switching to interactive mode...");
    }
    const interactiveConfig = await collectProjectInfo();
    console.log("\n📋 Configuration Summary:");
    printSummary(interactiveConfig);

    const confirm = await question("Proceed with initialization? (y/N): ");
    if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
      console.log("❌ Initialization cancelled");
      rl.close();
      process.exit(0);
    }
    config = interactiveConfig;
  }

  console.log("\n🔄 Processing files...\n");

  // Get all files in the project
  const allFiles = getAllFiles(process.cwd());

  // Filter files that typically contain template placeholders
  const targetFiles = allFiles.filter((file) => {
    const ext = path.extname(file);
    const basename = path.basename(file);

    // Include common file types that might contain placeholders
    return (
      [
        ".json",
        ".toml",
        ".md",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".mjs",
        ".css",
        ".html",
        ".yaml",
        ".yml",
        ".conf",
        ".env",
      ].includes(ext) ||
      ["README.md", "package.json", "wrangler.toml"].includes(basename)
    );
  });

  let processedCount = 0;

  for (const file of targetFiles) {
    try {
      replaceInFile(file, config);
      processedCount++;
    } catch (error) {
      console.log(`❌ Error processing ${file}: ${error}`);
    }
  }

  // Delete old migrations
  const migrationsDir = path.join("packages", "db", "migrations");
  if (fs.existsSync(migrationsDir)) {
    const confirmDelete = await question(
      "\nFound existing database migrations. Do you want to delete them? (y/N): ",
    );
    if (
      confirmDelete.toLowerCase() === "y" ||
      confirmDelete.toLowerCase() === "yes"
    ) {
      console.log("🗑️ Deleting existing database migrations...");
      try {
        fs.rmSync(migrationsDir, { recursive: true, force: true });
        console.log("✓ Migrations directory deleted.");
      } catch (error) {
        console.log(`❌ Error deleting migrations directory: ${error}`);
      }
    } else {
      console.log("Skipping deletion of migrations directory.");
    }
  }

  // Save configuration to repo.conf
  console.log("\n💾 Saving configuration...");
  saveConfigToFile(config);

  console.log("\n✅ Initialization complete!");
  console.log(`   Processed ${processedCount} files`);
  console.log(`   Project "${config.projectName}" is ready to use\n`);

  console.log("🎯 Next steps:");
  if (!config.cloudflareAccountId) {
    console.log("   1. Add Cloudflare account ID to wrangler.toml files");
  }
  if (!config.cloudflareZoneId) {
    console.log(
      "   2. Add Cloudflare zone ID to wrangler.toml files for custom domains",
    );
  }
  console.log("   3. Set up your environment variables");
  console.log("   4. Run pnpm install to install dependencies");
  console.log("   5. Run pnpm dev to start development\n");

  console.log("💡 This template implements Spec-Driven Development.");
  console.log(
    "   It flips the script on traditional software development where specifications become executable, directly generating working implementations.",
  );
  console.log(
    "   Learn more about this approach at: https://github.com/github/spec-kit",
  );

  rl.close();
}

main().catch(console.error);
