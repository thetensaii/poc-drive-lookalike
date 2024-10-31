import { FileSystemElement } from "./FileSystemElement";

export class File extends FileSystemElement {
  constructor(_id: string, _name:string, _path:string){
    super(_id, _name, _path, false);
  }
}