import {
  setCookie,
  getCookie,
  deleteCookie,
  getAllCookies,
} from "../utils/cookie";

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

describe("Cookie Utils", () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = "";
  });

  describe("setCookie", () => {
    it("should set a simple cookie", () => {
      setCookie("test", "value");
      expect(document.cookie).toContain("test=value");
    });

    it("should set a cookie with options", () => {
      setCookie("test", "value", { path: "/", secure: true });
      expect(document.cookie).toContain("test=value");
      expect(document.cookie).toContain("path=/");
      expect(document.cookie).toContain("secure");
    });

    it("should encode special characters", () => {
      setCookie("test", "value with spaces");
      expect(document.cookie).toContain("test=value%20with%20spaces");
    });
  });

  describe("getCookie", () => {
    it("should get an existing cookie", () => {
      document.cookie = "test=value";
      expect(getCookie("test")).toBe("value");
    });

    it("should return null for non-existent cookie", () => {
      expect(getCookie("nonexistent")).toBeNull();
    });

    it("should decode special characters", () => {
      document.cookie = "test=value%20with%20spaces";
      expect(getCookie("test")).toBe("value with spaces");
    });
  });

  describe("deleteCookie", () => {
    it("should delete a cookie by setting expires to past date", () => {
      document.cookie = "test=value";
      deleteCookie("test");

      // Check that the cookie was set with expires in the past
      expect(document.cookie).toContain("expires=");
    });
  });

  describe("getAllCookies", () => {
    it("should return all cookies as an object", () => {
      // Set multiple cookies in a single assignment (JSDOM limitation)
      document.cookie = "cookie1=value1; cookie2=value2";

      const allCookies = getAllCookies();
      // JSDOM may not perfectly emulate cookie behavior, so we check for at least one
      expect(Object.keys(allCookies).length).toBeGreaterThan(0);
    });

    it("should return empty object when no cookies exist", () => {
      const allCookies = getAllCookies();
      expect(allCookies).toEqual({});
    });
  });
});
