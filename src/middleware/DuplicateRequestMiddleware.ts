import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DuplicateRequestMiddleware implements NestMiddleware {
  private cache: Map<string, number> = new Map();

  async use(req: Request, res: Response, next: NextFunction) {
    const cacheKey = this.generateCacheKey(req);
    if (this.cache.has(cacheKey)) {
      const lastRequestTime = this.cache.get(cacheKey) || 0;
      const currentTime = Date.now();

      if (currentTime - lastRequestTime < 30000) {
        return res.status(200).json({
          status: true,
          message: 'Because there is duplicate request in same time, the data is not saved',
        });
      }
    }

    this.cache.set(cacheKey, Date.now());
    next();
  }

  private generateCacheKey(req: Request): string {
    return `${req.method}-${req.originalUrl}-${JSON.stringify(req.body)}`;
  }
}
