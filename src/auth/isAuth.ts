export function isAuth() {
  return Boolean(localStorage.getItem("token"));
}
