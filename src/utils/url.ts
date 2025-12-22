export function jumpToLogin() {
  location.href = `${process.env.LOGIN_URL}?redirect=${encodeURIComponent(
    location.href
  )}`;
}
