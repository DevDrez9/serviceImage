import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = process.env.UPLOAD_SECRET;

    if (!validApiKey) {
        console.error('UPLOAD_SECRET is not defined in environment variables');
        return false;
    }

    if (apiKey === validApiKey) {
      return true;
    }

    throw new ForbiddenException('Invalid API Key');
  }
}
