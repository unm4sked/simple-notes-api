import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DateTime } from "luxon";
import type { Logger } from "pino";

import type { Config } from "../../shared/config";
import { markdownScheme } from "../../shared/markdown";
import { FullNote } from "../interfaces/note";

export class S3Service {
  constructor(private client: S3Client, private config: Config, private logger: Logger) {}

  async uploadAsMarkdownFile(note: FullNote) {
    const key = `${note.id}-note.md`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.s3BucketName,
        Key: key,
        Body: markdownScheme(note),
        Expires: DateTime.now().plus({ minutes: 15 }).toJSDate(),
      }),
    );

    this.logger.info(`File [${key}] uploaded to bucket [${this.config.s3BucketName}]`);
    return key;
  }

  async generateGetObjectPresignUrl(key: string) {
    const command = new GetObjectCommand({ Bucket: this.config.s3BucketName, Key: key });
    const url = await getSignedUrl(this.client, command, { expiresIn: 900 });

    this.logger.info(
      `Generated url for file [${key}], is valid until [${DateTime.now().plus({ seconds: 900 }).toISO()}]`,
    );

    return url;
  }
}
