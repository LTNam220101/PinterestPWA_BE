import { Bucket } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseService {
  bucket: Bucket;
  constructor(configService: ConfigService) {
    const app = firebase.initializeApp({
      credential: applicationDefault(),
      storageBucket: configService.get('FIREBASE_STORAGEBUCKET'),
    });
    this.bucket = getStorage(app).bucket();
  }

  async uploadFile(file: Express.Multer.File, filename: string, path = '') {
    const bucketFile = this.bucket.file(`${path}/${filename}`);
    await bucketFile.save(file.buffer, {
      public: true,
      metadata: { contentType: file.mimetype },
    });
    console.log(`file is available at ${bucketFile.publicUrl()}`);
    return bucketFile.publicUrl();
  }

  async uploadFromBuffer(
    file: Buffer,
    filename: string,
    path = '',
    metadata: any,
  ) {
    const bucketFile = this.bucket.file(`${path}/${filename}`);
    await bucketFile.save(file, {
      public: true,
      metadata: metadata,
    });
    console.log(`file is available at ${bucketFile.publicUrl()}`);
    return bucketFile.publicUrl();
  }

  async removeFile(fileName: string) {
    await this.bucket.file(fileName).delete({});
  }
}
