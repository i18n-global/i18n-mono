export interface CookieOptions {
  expires?: number; // days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {},
): void => {
  if (typeof document === "undefined") {
    return; // SSR support
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    const date = new Date();
    date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += "; secure";
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null; // SSR support
  }

  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

export const deleteCookie = (
  name: string,
  options: Omit<CookieOptions, "expires"> = {},
): void => {
  setCookie(name, "", { ...options, expires: -1 });
};

export const getAllCookies = (): Record<string, string> => {
  if (typeof document === "undefined") {
    return {}; // SSR support
  }

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(";");

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    const [name, value] = cookie.split("=");
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
};
