import { PassThrough } from "stream";

import type { UploadHandler } from "@remix-run/node";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import {
  S3Client,
  // ListObjectsV2Command,
  // GetObjectCommand,
  PutObjectCommand,
  // DeleteObjectCommand,
  // CopyObjectCommand
} from "@aws-sdk/client-s3";

import { Upload } from "@aws-sdk/lib-storage";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

if (!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_REGION)) {
  throw new Error(`Storage is missing required configuration.`);
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

const uploadStream = ({ key, bucket }: { key: string; bucket: string }) => {
  // upload.on("httpUploadProgress", (progress) => {
  //  console.log(progress);
  // });
  const pass = new PassThrough();
  return {
    writeStream: pass,
    promise: new Upload({
      params: {
        Bucket: bucket,
        Key: key,
        Body: pass,
      },
      client: s3,
      queueSize: 3,
    }).done(),
  };
};

export async function uploadStreamToS3(
  data: AsyncIterable<Uint8Array>,
  filename: string,
  key: string,
  bucket: string,
) {
  const stream = uploadStream({ key, bucket });
  await writeAsyncIterableToWritable(data, stream.writeStream);
  const file = await stream.promise;
  console.log(file);
  return file.Key;
}

export const s3UploadHandler =
  ({ key, bucket }: { bucket: string; key: string }): UploadHandler =>
  async ({ filename, data }) => {
    const fileKey = await uploadStreamToS3(data, filename!, key, bucket);
    return fileKey;
  };
