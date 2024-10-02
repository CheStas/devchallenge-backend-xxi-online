import { Injectable, Logger } from "@nestjs/common";
import { BucketService } from "./bucket.service";
import { HttpService } from "@nestjs/axios";
import { mongo, Types } from 'mongoose';
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class FileService {
    constructor(
        private bucketService: BucketService,
        private readonly httpService: HttpService,
        private readonly logger: Logger,
    ) {
    }

    async saveFile(id: string, url: string): Promise<{
        fileId: Types.ObjectId;
        id: string;
        url: string;
    }> {
        const objectId = new Types.ObjectId();
        const metadata = { id, url };
        const response = await firstValueFrom(
            this.httpService.get(url, { responseType: 'stream' })
            .pipe(
                catchError((error: AxiosError) => {
                const errorResponse = error?.response?.data || error;
                this.logger.error(errorResponse);
                throw errorResponse;
            }))
        );
        return new Promise((resolve, reject) => {
            response.data.pipe(this.bucketService.openUploadStreamWithId(objectId, `${Date.now()}-${url}`, { metadata }))
                .on('finish', () => resolve({ fileId: objectId, id, url }))
                .on('error', reject);
        });
    }

    getFileById(objectId: mongo.ObjectId) {
        return this.bucketService.find({ _id: objectId }).toArray();
    }

    getFileByUrl(url: string) {
        return this.bucketService.find({ metadata: { url } }).toArray();
    }

    readFileByObjectId(objectId: mongo.ObjectId) {
        return this.bucketService.openDownloadStream(objectId);
    }
}