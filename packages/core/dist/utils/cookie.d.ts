export interface CookieOptions {
    expires?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
}
export declare const setCookie: (name: string, value: string, options?: CookieOptions) => void;
export declare const getCookie: (name: string) => string | null;
export declare const deleteCookie: (name: string, options?: Omit<CookieOptions, "expires">) => void;
export declare const getAllCookies: () => Record<string, string>;
//# sourceMappingURL=cookie.d.ts.map