import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getR2Client() {
  const accountId = getEnv("R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

export async function uploadToR2(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  const client = getR2Client();
  const bucket = getEnv("R2_BUCKET_NAME");
  const publicUrl = getEnv("R2_PUBLIC_URL").replace(/\/$/, "");

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    }),
  );

  return `${publicUrl}/${params.key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  const bucket = getEnv("R2_BUCKET_NAME");
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}