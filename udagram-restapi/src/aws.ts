import {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {config} from './config/config';

const c = config.dev;

// Configure AWS S3 client.
let s3: S3Client;
if (c.aws_profile !== 'DEPLOYED') {
  s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY,
      secretAccessKey: process.env.MINIO_SECRET_KEY,
    },
    endpoint: process.env.ENDPOINT,
    forcePathStyle: true,
  });
} else {
  s3 = new S3Client({ region: c.aws_region });
}

export { s3 };

/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export async function getGetSignedUrl(key: string): Promise<string> {

  const signedUrlExpireSeconds = 60 * 5;

  return await getSignedUrl(s3,
    new GetObjectCommand({
      Bucket: c.aws_media_bucket,
      Key: key,
    }), {expiresIn: signedUrlExpireSeconds});
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export async function getPutSignedUrl(key: string) {

  const signedUrlExpireSeconds = 60 * 5;

  return await getSignedUrl(s3,
    new PutObjectCommand({
      Bucket: c.aws_media_bucket,
      Key: key,
    }), {expiresIn: signedUrlExpireSeconds});
}
