export function formatSize(fileSize) {
  if (typeof fileSize !== 'number' || isNaN(fileSize) || fileSize < 0) {
    return 'Invalid file size';
  }
  if (fileSize < 1024) {
    return fileSize + ' bytes';
  } else if (fileSize < 1024 * 1024) {
    return (fileSize / 1024).toFixed(2) + ' KB';
  } else if (fileSize < 1024 * 1024 * 1024) {
    return (fileSize / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (fileSize / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}
