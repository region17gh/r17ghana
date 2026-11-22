export function adminSignInOptions(origin: string) {
  return { shouldCreateUser: false, emailRedirectTo: `${origin}/admin` };
}