export default function unencodehtml(input: string): string {
  return `${input}`.replace(/&#\d+;/gm, (s) => {
    const match = s.match(/\d+/);
    if (match?.[0]) {
      return String.fromCharCode(parseInt(match[0], 10));
    }
    return s;
  });
}
