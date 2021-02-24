import {
  Body,
  Controller,
  Get,
  NotFoundException,
  OnModuleInit,
  Post,
  Render,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, response, Response } from 'express';
import { fstat } from 'fs';
import { request } from 'http';
import { join, normalize } from 'path';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get('setup')
  @Render('setup')
  setup(@Res() response: Response) {
    if (this.authService.isSetUp()) response.redirect('/');
    return {};
  }

  @Get('login')
  @Render('login')
  login(@Session() session: Record<string, any>) {
    if (session.isLoggedIn) response.redirect('/');
  }

  @Post('upload*')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  upload(
    @UploadedFiles() files,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    if (files.length < 1) response.redirect(request.path.substr(7));
    for (let file of files) {
      const path = join(normalize(request.path.substr(7)), file.originalname);
      this.appService.storeFile(path, file.buffer);
    }
    response.redirect(request.path.substr(7));
  }

  @Post('mkdir')
  @UseGuards(AuthGuard)
  mkdir(@Body() data: { path: string }) {
    const path = normalize(data.path).replace(/\/$/, '');
    if (!/^[A-Za-z0-9_\- ]*$/.test(path.split('/').slice(-1)[0]))
      return {
        created: false,
        message:
          'Name contains illegal characters. Allowed are only A-Z a-z 0-9 _-.[]() and spaces.',
      };
    const created = this.appService.createFolder(data.path);
    return {
      created,
      message: created ? undefined : 'Folder already exists.',
    };
  }

  @Get('raw*')
  download(@Req() request: Request, @Res() response: Response) {
    const path: string = normalize(decodeURI(request.path))
      .replace(/\/$/, '')
      .substr(4);
    if (!this.appService.exists(path) || this.appService.isFolder(path))
      throw new NotFoundException();
    //response.contentType(this.appService.lookup(path));
    response.sendFile(this.appService.getAbsolutePath(path));
  }

  @Get('*')
  browse(
    @Req() request: Request,
    @Res() response: Response,
    @Session() session: Record<string, any>,
  ) {
    const path: string = normalize(decodeURI(request.path)).replace(
      /^\/|\/$/g,
      '',
    );
    if (!this.appService.exists(path)) throw new NotFoundException();
    if (this.appService.isFolder(path)) {
      if (!session.isLoggedIn) {
        response.redirect('/login');
        return;
      }
      return response.render('browse', {
        files: this.appService.readFolder(path),
        rootFolder: path,
      });
    }
    const file = path.split('/').splice(-1)[0];
    return response.render('download', {
      file,
      extension: file.includes('.') ? file.split('.').splice(-1)[0] : undefined,
      size: this.appService.getSize(path),
      rootFolder: path
        .split('/')
        .filter((element) => element.length > 0)
        .slice(0, -1)
        .join('/'),
    });
  }
}
