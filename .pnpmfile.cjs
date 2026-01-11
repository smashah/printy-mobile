/**
 * pnpm hook to strip heavy dependencies when SKIP_HEAVY_JOBS=1
 *
 * Usage:
 *   SKIP_HEAVY_JOBS=1 pnpm install  # Fast install for CI/webapp deploys
 *   pnpm install                     # Full install with heavy deps
 *
 * This optimization can reduce install times from 5+ minutes to under 1 minute
 * for deployments that don't need media processing packages.
 */
function readPackage(pkg, context) {
  // Skip heavy deps when SKIP_HEAVY_JOBS=1
  if (
    (pkg.name === "@repo/jobs" || pkg.name === "@repo/rbg-api") &&
    process.env.SKIP_HEAVY_JOBS === "1"
  ) {
    context.log(`Skipping heavy dependencies for ${pkg.name}`);

    const heavyDeps = [
      "sharp",
      "ffmpeg-static",
      "ffprobe-static",
      "@imgly/background-removal-node",
      "onnxruntime-node",
      "esbuild",
    ];

    if (pkg.dependencies) {
      heavyDeps.forEach((dep) => {
        if (pkg.dependencies[dep]) {
          delete pkg.dependencies[dep];
          context.log(`Removed dependency: ${dep}`);
        }
      });
    }

    if (pkg.optionalDependencies) {
      heavyDeps.forEach((dep) => {
        if (pkg.optionalDependencies[dep]) {
          delete pkg.optionalDependencies[dep];
          context.log(`Removed optional dependency: ${dep}`);
        }
      });
    }
  }

  return pkg;
}

module.exports = { hooks: { readPackage } };
