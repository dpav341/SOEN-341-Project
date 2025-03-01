export function handleCookies(cookies, callback) {
  cookies.forEach(cookie => callback(cookie.name, cookie.value, cookie.options || {
    path: "/"
  }));
};