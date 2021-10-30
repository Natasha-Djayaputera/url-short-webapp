const ID_CHARACTER_SET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function validateCustomId(id: string): boolean {
  return id.split("").every((char) => ID_CHARACTER_SET.includes(char));
}
