import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('upload')
@UseGuards(ApiKeyGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file')) // memoryStorage is default behavior if no storage option passed
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder: string,
    ) {
        const url = await this.uploadService.optimizeAndSave(file, folder);
        return { url };
    }
}
