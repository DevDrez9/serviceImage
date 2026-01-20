import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    async optimizeAndSave(file: Express.Multer.File, folder: string): Promise<string> {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        if (!folder) {
            throw new BadRequestException('Folder is required');
        }

        // Clean folder path to prevent directory traversal
        const safeFolder = folder.replace(/\.\./g, '');
        const uploadDir = path.join(process.cwd(), 'uploads', safeFolder);

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const filename = `image-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
        const filepath = path.join(uploadDir, filename);

        try {
            // Process image
            const image = sharp(file.buffer);
            const metadata = await image.metadata();

            if (metadata.width && metadata.width > 1920) {
                image.resize(1920);
            }

            await image
                .webp({ quality: 80 })
                .toFile(filepath);

            // Return public URL (assuming served from root/uploads)
            // In a real scenario, you might want to prepend the domain from config
            // For now, returning the relative path as requested in the JSON example:
            // "http://midominio.com/uploads/inmobiliaria/propiedades/foto-123.webp"
            // We will construct it based on a BASE_URL env var or similar, or just return the path relative to domain root.
            // Let's assume a default local base for now or use relative if not provided.

            const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Fallback
            // Ensure strict slash handling
            const urlPath = path.posix.join('uploads', safeFolder, filename);

            return `${baseUrl}/${urlPath}`;

        } catch (error) {
            console.error('Image processing error:', error);
            throw new BadRequestException('Error processing image');
        }
    }
}
