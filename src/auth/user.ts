export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export function isAuth() {
  return Boolean(getUserFromToken());
}

export function isAdmin() {
  const user = getUserFromToken();
  return user?.role === "admin";
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
