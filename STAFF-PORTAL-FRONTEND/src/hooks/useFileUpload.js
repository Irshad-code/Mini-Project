import { useState } from 'react';

export function useFileUpload(initialDocuments = []) {
  const [uploadedFiles, setUploadedFiles] = useState(
    initialDocuments.map((doc) => ({
      id: doc.id,
      name: doc.name,
      url: doc.url,
      file: new File([], doc.name), // placeholder file object
    }))
  );

  const getDocumentsFromFiles = () => {
    return uploadedFiles.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
    }));
  };

  return {
    uploadedFiles,
    setUploadedFiles,
    getDocumentsFromFiles,
  };
}
