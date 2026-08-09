import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import type { MediaStoragePort } from '../ports/admin-document-repository'
import type { ObjectStorageCleanupPort } from '../ports/content-operations'

function r2Configuration() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    throw new Error('R2 configuration is incomplete')
  }
  const client = new S3Client({
    credentials: { accessKeyId, secretAccessKey },
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: 'auto',
  })
  return { bucket, client, publicBaseUrl }
}

export class R2MediaStorage implements MediaStoragePort, ObjectStorageCleanupPort {
  async deleteObject(objectKey: string): Promise<void> {
    const { bucket, client } = r2Configuration()
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }))
  }

  async signUpload(input: { mimeType: string; objectKey: string; size: number }) {
    const { bucket, client, publicBaseUrl } = r2Configuration()
    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: bucket,
        ContentLength: input.size,
        ContentType: input.mimeType,
        Key: input.objectKey,
      }),
      { expiresIn: 600 },
    )
    return {
      method: 'PUT' as const,
      publicUrl: `${publicBaseUrl.replace(/\/$/, '')}/${input.objectKey}`,
      uploadUrl,
    }
  }
}
