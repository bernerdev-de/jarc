import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';

@Injectable()
export class SetupMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: () => void) {
    if (!this.authService.isSetUp()) res.redirect('/setup');
    else next();
  }
}
