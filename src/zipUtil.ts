import JSZip from 'jszip';

export const downloadZipFile = async (url: string) => {
  const fetched = await fetch(url, { mode: 'cors' });
  const bytes = await fetched.blob();
  return bytes;
};

export const getFileFromJSZipFile = async (file: JSZip.JSZipObject) => {
  const fileData = await file.async('blob');
  const filename = file.name.split('/').pop();
  return new File([fileData], filename);
};

export const readZipFile = async (bytes: Blob | File, extraPath: string = '') => {
  const zipper = new JSZip();
  const unzippedFiles = await zipper.loadAsync(bytes);
  return Promise.resolve(unzippedFiles).then((unzipped) => {
    if (!Object.keys(unzipped.files).length) {
      return Promise.reject('No file was found');
    }

    const files: JSZip.JSZipObject[] = [];
    const regex = new RegExp(extraPath + '(.+)\\.svg', 'g');
    Object.entries(unzippedFiles.files).forEach(([k, v]: [string, JSZip.JSZipObject]) => {
      const matched = k.match(regex);
      if (matched && matched.length > 0) {
        files.push(v);
      }
    });

    return files;
  });
};
