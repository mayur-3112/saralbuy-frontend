export const maskOrganizationName = (name) => {
  if (!name) return '*********';
  
  const words = name.split(' ');
  if (words.length === 1) {
    if (name.length <= 4) return '****';
    return '*'.repeat(name.length - 4) + name.slice(-4);
  }

  // Mask the first word entirely, leave the rest
  const firstWord = words[0];
  const maskedFirst = '*'.repeat(firstWord.length);
  return [maskedFirst, ...words.slice(1)].join(' ');
};
