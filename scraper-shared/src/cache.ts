import fs from "fs";

export interface ICache {
  contains(key: string): boolean;
  get(key: string): string;
  set(key: string, data: string): void;
}

export class DiskCache implements ICache {
  constructor(private directory: string) {}

  private getPath(key: string) {
    return this.directory + "/" + key;
  }

  contains(key: string) {
    return fs.existsSync(this.getPath(key));
  }

  get(key: string) {
    return fs.readFileSync(this.getPath(key), "utf8");
  }

  set(key: string, data: string) {
    fs.writeFileSync(this.getPath(key), data, { encoding: "utf8" });
  }
}
