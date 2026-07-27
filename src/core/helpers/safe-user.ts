export type SafeUserCookie = {
  name: string;
  role: string;
};

export function toSafeUser(user: {
  name: string;
  role: string;
}): SafeUserCookie {
  return { name: user.name, role: user.role };
}
