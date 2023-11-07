export function slash(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path);

  if (isExtendedLengthPath || hasNonAscii) {
    return path;
  }

  return path.replace(/\\/g, "/");
}

/**
 * support == and !=
 */
export function getComparisonOperator(str: string) {
  const regex = /(?:==|!=)\s/;
  const match = str.match(regex);
  if (match) {
    return match[0].trim();
  }
  return null;
}
