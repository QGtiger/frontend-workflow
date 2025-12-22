import OSS from "ali-oss";

const client = new OSS({
  region: "oss-cn-beijing",
  bucket: "lf-ipaas",
  accessKeyId: process.env.OSS_ACCESS_KEYID!,
  accessKeySecret: process.env.OSS_ACCESS_KEYSECRECT!,
});

export async function uploadFile(file: File) {
  return client
    .put(file.name, file, {
      headers: {
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    })
    .then((result) => result.url);
}

export function jumpToLogin() {
  location.href = `${process.env.LOGIN_URL}?redirect=${encodeURIComponent(
    location.href
  )}`;
}
