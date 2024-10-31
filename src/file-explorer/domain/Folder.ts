import { FileSystemElement } from "./FileSystemElement";

export class Folder extends FileSystemElement {
  constructor(_id: string, _name:string, _path:string){
    super(_id, _name, _path, true);
  }
}

export const isFolder = (fse: FileSystemElement): fse is Folder => {
  return fse.isFolder;
}