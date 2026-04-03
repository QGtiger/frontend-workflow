import OSS from "ali-oss";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
});

function walkDir(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const key = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath, key));
    } else {
      files.push({ localPath: fullPath, key });
    }
  }
  return files;
}

async function deploy() {
  const files = walkDir(distDir);
  console.log(`Found ${files.length} files to upload`);

  const results = await Promise.all(
    files.map(({ localPath, key }) =>
      client.put(key, localPath).then((res) => ({ key, ok: res.res.status === 200 }))
    )
  );

  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  console.log(`Done: ${ok} succeeded, ${fail} failed`);

  if (fail > 0) process.exit(1);
}

await deploy().catch((err) => {
  console.error(err);
  process.exit(1);
});
