export abstract class FileSystemElement {

  constructor(private _id: string, private _name:string, private _path:string, private _isFolder:boolean){}

  get id(){
    return this._id;
  }

  get name(){
    return this._name;
  }

  get path() {
    return this._path;
  }

  get isFolder(){
    return this._isFolder;
  }
}