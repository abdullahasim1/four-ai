const TOKEN_KEY = "fourai_token";
const USER_KEY = "fourai_user";

export function getSession() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    return token && user ? { token, user } : null;
  } catch {
    clearSession();
    return null;
  }
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return Boolean(getSession());
}

export function isAdmin() {
  const session = getSession();
  return session?.user?.role === "admin";
}
