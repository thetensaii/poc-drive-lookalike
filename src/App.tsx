import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileBrowser } from './file-explorer/ui/FileBrowser';
import { useFileStructure } from './file-explorer/ui/hooks/useFileStructure';
import { useEffect } from 'react';

// Somewhere in your `index.ts`:
setChonkyDefaults({ iconComponent: ChonkyIconFA });

function App() {

  const { files, folderChain, openFolder, deleteElements, downloadFile, uploadFile, createFolder } = useFileStructure()

  useEffect(() => {
    (async () => {
      await openFolder();
    })().catch(console.error);
  }, [openFolder])

  

  return (
    <main>
      <FileBrowser 
        files={files} 
        folderChain={folderChain} 
        onOpenFolder={openFolder} 
        onDeleteElements={deleteElements} 
        onDownloadFile={downloadFile}
        onUploadFile={uploadFile}
        onCreateFolder={createFolder}
      />
    </main>
  )
}

export default App
