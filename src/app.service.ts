import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import * as mime from 'mime-types';
import * as cp from 'child_process';

@Injectable()
export class AppService implements OnModuleInit {
  private root = join(__dirname, '..', 'data');

  async onModuleInit() {
    if (!fs.existsSync(this.root)) fs.mkdirSync(this.root);
  }

  exists(path: string): boolean {
    return fs.existsSync(join(this.root, path));
  }

  isFolder(path: string): boolean {
    return fs.statSync(join(this.root, path)).isDirectory();
  }

  readFolder(path: string): { name: string; folder: boolean }[] {
    if (!this.exists(path) || !this.isFolder(path)) return undefined;
    const list = fs.readdirSync(join(this.root, path), 'utf-8');
    return list
      .map((element) => {
        return {
          name: element,
          folder: this.isFolder(join(path, element)),
        };
      })
      .sort((element) => (element.folder ? -1 : 1));
  }

  lookup(path: string): string {
    if (!this.exists(path) || this.isFolder(path)) return undefined;
    return mime.lookup(join(this.root, path)) || 'application/octet-stream';
  }

  getAbsolutePath(path: string): string {
    return join(this.root, path);
  }

  storeFile(path: string, buffer: Buffer) {
    fs.writeFileSync(join(this.root, path), buffer);
  }

  getSize(path: string) {
    let bytes = fs.statSync(join(this.root, path)).size;

    if (Math.abs(bytes) < 1000) return bytes + ' B';

    const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** 2;

    do {
      bytes /= 1000;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= 1000 &&
      u < units.length - 1
    );

    return '~ ' + bytes.toFixed(2) + ' ' + units[u];
  }

  createFolder(path: string): boolean {
    if (!fs.existsSync(join(this.root, path))) {
      fs.mkdirSync(join(this.root, path));
      return true;
    }
    return false;
  }
}