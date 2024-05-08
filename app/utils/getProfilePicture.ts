import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = process.env.BUCKET_NAME || "";
const bucketRegion = process.env.BUCKET_REGION || "";
const accessKey = process.env.AWS_ACCESS_KEY || "";
const secretKey = process.env.AWS_SECRET_KEY || "";

const bucket: S3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    secretAccessKey: secretKey,
    accessKeyId: accessKey
  }
});

export const getProfilePicture = async (profilePhotoName: string) => {
  const getObjectParams = {
    Bucket: bucketName,
    Key: profilePhotoName
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(bucket, command, { expiresIn: 3600 });
  return url;
};
