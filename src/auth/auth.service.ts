import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import crypto from 'src/utils/crypto';

@Injectable()
export class AuthService implements OnModuleInit {
  //TODO: Accounts, Users, longer sessions
  private password: string = undefined;

  async onModuleInit() {
    // I know, i know a stupid solution, but it will be improved. Just needed a quick dirty solution, i swear!
    if (fs.existsSync(join(process.cwd(), 'password.txt')))
      this.password = fs.readFileSync(join(process.cwd(), 'password.txt')).toString('utf-8');
  }

  isSetUp(): boolean {
    return !!this.password;
  }

  setPassword(password: string) {
    this.password = crypto.hash(password);
    fs.writeFileSync(join(process.cwd(), 'password.txt'), this.password);
  }

  validatePassword(password: string): boolean {
    return crypto.verify(password, this.password);
  }
}
