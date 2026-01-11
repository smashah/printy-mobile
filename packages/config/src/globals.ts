/**
 * Project Global Constants
 *
 * These values are populated from repo.conf during project initialization.
 * They represent project-level metadata that can be shared across all apps.
 *
 * Usage:
 * ```typescript
 * import { projectName, projectSlug, apiPort, domain, apiDomain } from '@printy-mobile/config/globals';
 *
 * // Use in SEO meta tags, titles, etc.
 * <title>{projectName} | {projectSlogan}</title>
 *
 * // Use for API endpoints
 * const apiUrl = `http://localhost:${apiPort}`;
 * const productionApiUrl = `https://${apiDomain}`;
 * ```
 */

// ============================================================================
// Project Metadata
// ============================================================================

/** Project display name */
export const projectName = "Printy Mobile";

/** Project slug (kebab-case identifier) */
export const projectSlug = "printy-mobile";

/** Project tagline/slogan */
export const projectSlogan = "Print labels anywhere with your mobile device";

/** Project description for SEO and meta tags */
export const projectDescription = "Mobile-first thermal printing application for generating labels, tickets, and documents on the go";

// ============================================================================
// Domains & URLs
// ============================================================================

/** Main domain (e.g., "example.com") */
export const domain = "printy.mobile";

/** API subdomain (e.g., "api.example.com") */
export const apiDomain = `api.${domain}`;

/** Dashboard/backoffice subdomain (e.g., "dashboard.example.com") */
export const dashboardDomain = `dashboard.${domain}`;

/** Main app URL (production) */
export const appUrl = `https://${domain}`;

/** API URL (production) */
export const apiUrl = `https://${apiDomain}`;

/** Dashboard URL (production) */
export const dashboardUrl = `https://${dashboardDomain}`;

// ============================================================================
// Development Ports
// ============================================================================

/** Base port prefix for development servers */
export const portPrefix = 8930;

/** API server port */
export const apiPort = 8930;

/** Backoffice server port */
export const backofficePort = 8931;

/** Webapp server port */
export const webappPort = 8932;

/** Database server port (if applicable) */
export const dbPort = 8933;

// ============================================================================
// Development URLs
// ============================================================================

/** API URL (development) */
export const devApiUrl = `http://localhost:8930`;

/** Webapp URL (development) */
export const devWebappUrl = `http://localhost:8932`;

/** Backoffice URL (development) */
export const devBackofficeUrl = `http://localhost:8931`;

// ============================================================================
// Cloudflare Project Names
// ============================================================================

/** Cloudflare Worker name for API */
export const apiName = `${projectSlug}-api`;

/** Cloudflare Worker name for webapp */
export const webappName = `${projectSlug}-webapp`;

/** Cloudflare Worker name for backoffice */
export const backofficeName = `${projectSlug}-backoffice`;

/** D1 Database name */
export const d1DatabaseName = `${projectSlug}-d1-database`;

/** D1 Database name for production */
export const d1DatabaseProductionName = `${projectSlug}-d1-database`;

/** R2 Bucket name for development */
export const r2BucketDevName = `${projectSlug}-dev`;

/** R2 Bucket name for production */
export const r2BucketProductionName = `${projectSlug}-production`;

// ============================================================================
// Cloudflare Configuration (Optional)
// ============================================================================

/** Cloudflare Account ID (optional, set during initialization) */
export const cloudflareAccountId: string | undefined = undefined;

/** Cloudflare Zone ID (optional, set during initialization) */
export const cloudflareZoneId: string | undefined = undefined;
