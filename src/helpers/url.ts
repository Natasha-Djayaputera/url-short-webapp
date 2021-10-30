export function isValidHttpUrl(candidateUrl: string): boolean {
  try {
    return /^https?:$/g.test(new URL(candidateUrl).protocol);
  } catch {
    return false;
  }
}
