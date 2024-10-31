export type UIFileSystemElement = {
  id: string,
  name: string,
  isDir: boolean
}

export type UIFile = UIFileSystemElement & { isDir: false }
export type UIFolder = UIFileSystemElement & { isDir: true }

export type UIFiles = UIFileSystemElement[]
export type UIFolderChain = UIFolder[]