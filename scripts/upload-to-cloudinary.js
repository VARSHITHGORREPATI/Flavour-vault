/**
 * Upload all images and videos from public/img to Cloudinary
 * and update details.json + chiefs data with Cloudinary URLs.
 *
 * Usage:
 *   node scripts/upload-to-cloudinary.js
 *
 * Prerequisites:
 *   - Add to .env:
 *       CLOUDINARY_CLOUD_NAME=your_cloud_name
 *       CLOUDINARY_API_KEY=your_api_key
 *       CLOUDINARY_API_SECRET=your_api_secret
 */

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// ── Cloudinary config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Paths ────────────────────────────────────────────────────────────────────
const ROOT = path.join(__dirname, "..");
const GALLERY_DIR = path.join(ROOT, "public", "img", "gallery");
const CHIEFS_DIR = path.join(ROOT, "public", "img", "top-chiefs");
const DETAILS_JSON = path.join(ROOT, "details.json");
const URL_MAP_FILE = path.join(ROOT, "scripts", "cloudinary-url-map.json");

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Upload a single file to Cloudinary.
 * Videos use resource_type: "video", images use "image".
 */
async function uploadFile(filePath, folder) {
  const ext = path.extname(filePath).toLowerCase();
  const isVideo = [".mp4", ".mov", ".avi", ".webm"].includes(ext);
  const publicId = path.basename(filePath, ext); // filename without extension

  console.log(`  Uploading: ${path.basename(filePath)} → ${folder}/${publicId}`);

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    resource_type: isVideo ? "video" : "image",
    overwrite: false,          // skip if already uploaded
    use_filename: true,
    unique_filename: false,
  });

  return result.secure_url;
}

/**
 * Upload all files in a directory and return a map of
 * { "/img/gallery/filename.jpg" : "https://res.cloudinary.com/..." }
 */
async function uploadDirectory(dirPath, cloudFolder, urlPrefix) {
  const files = fs.readdirSync(dirPath).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov", ".JPG"].includes(ext);
  });

  const urlMap = {};

  for (const file of files) {
    const localPath = path.join(dirPath, file);
    try {
      const url = await uploadFile(localPath, cloudFolder);
      // Normalise key to lowercase for consistent matching
      const key = `${urlPrefix}/${file}`;
      urlMap[key] = url;
      // Also store lowercase version as a fallback key
      urlMap[`${urlPrefix}/${file.toLowerCase()}`] = url;
    } catch (err) {
      console.error(`  ✗ Failed: ${file} — ${err.message}`);
    }
  }

  return urlMap;
}

/**
 * Replace all image paths in details.json with Cloudinary URLs.
 */
function updateDetailsJson(urlMap) {
  const data = JSON.parse(fs.readFileSync(DETAILS_JSON, "utf8"));

  let replaced = 0;
  for (const recipe of data.recipes) {
    if (recipe.image) {
      const cloudUrl = urlMap[recipe.image] || urlMap[recipe.image.toLowerCase()];
      if (cloudUrl) {
        recipe.image = cloudUrl;
        replaced++;
      } else {
        console.warn(`  ⚠ No Cloudinary URL found for: ${recipe.image}`);
      }
    }
  }

  fs.writeFileSync(DETAILS_JSON, JSON.stringify(data, null, 2), "utf8");
  console.log(`\n✅ Updated ${replaced} image URLs in details.json`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Validate credentials
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error(
      "❌ Missing Cloudinary credentials.\n" +
      "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to your .env file."
    );
    process.exit(1);
  }

  console.log("🚀 Starting Cloudinary upload...\n");

  // Load existing URL map if a previous run was interrupted
  let existingMap = {};
  if (fs.existsSync(URL_MAP_FILE)) {
    existingMap = JSON.parse(fs.readFileSync(URL_MAP_FILE, "utf8"));
    console.log(`📂 Loaded ${Object.keys(existingMap).length} existing URLs from previous run.\n`);
  }

  // Upload gallery images + video
  console.log("📁 Uploading gallery (images + video)...");
  const galleryMap = await uploadDirectory(
    GALLERY_DIR,
    "flavourvault/gallery",
    "/img/gallery"
  );

  // Upload top-chiefs images
  console.log("\n📁 Uploading top-chiefs images...");
  const chiefsMap = await uploadDirectory(
    CHIEFS_DIR,
    "flavourvault/top-chiefs",
    "/img/top-chiefs"
  );

  // Merge all URL maps
  const fullMap = { ...existingMap, ...galleryMap, ...chiefsMap };

  // Save URL map to file (useful for debugging or re-running)
  fs.writeFileSync(URL_MAP_FILE, JSON.stringify(fullMap, null, 2), "utf8");
  console.log(`\n💾 URL map saved to: scripts/cloudinary-url-map.json`);

  // Update details.json
  console.log("\n📝 Updating details.json with Cloudinary URLs...");
  updateDetailsJson(fullMap);

  console.log("\n🎉 Done! All images are now on Cloudinary.");
  console.log("   Re-build your Docker containers to apply the changes:");
  console.log("   docker compose up --build\n");
}

main().catch((err) => {
  console.error("❌ Upload failed:", err.message);
  process.exit(1);
});
