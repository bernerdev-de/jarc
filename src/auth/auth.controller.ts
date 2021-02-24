import { Body, Controller, Post, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body() data: { password: string },
    @Session() session: Record<string, any>,
  ): { success: boolean; message?: string } {
    if (session.isLoggedIn)
      return {
        success: true,
      };
    if (!data.password)
      return {
        success: false,
        message: 'Please provide a password',
      };
    if (this.authService.validatePassword(data.password)) {
      session.isLoggedIn = true;
      return { success: true };
    }
    return {
      success: false,
      message: 'Invalid password',
    };
  }

  @Post('setup')
  setup(
    @Body() data: { password: string },
    @Session() session: Record<string, any>,
    @Res() response: Response,
  ) {
    if (this.authService.isSetUp())
      response.redirect('/');
    if (data.password.length == 0)
      response.send(JSON.stringify({ success: false, message: 'Please specify a password' }));
    this.authService.setPassword(data.password);
    response.send(JSON.stringify({ success: true }));
  }
}
