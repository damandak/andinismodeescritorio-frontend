// User accounts. The browser talks to Django on the site's own address
// (/djangoapi/... is routed to Django by nginx), so the session cookie and
// the CSRF cookie are first-party. Login, signup and passwords use allauth's
// API; the user's own data uses /djangoapi/me/.
//
// Locally, `npm run dev` proxies /djangoapi to the backend (nuxt.config.ts).

const AUTH = "/djangoapi/_allauth/browser/v1";

export type Me = {
  email: string;
  public_name: string;
  email_verified: boolean;
  andinist: { id: number; name: string } | null;
  claim: { andinist: { id: number; name: string }; status: string; pending: boolean } | null;
  is_editor: boolean;
};

/** Field errors keyed by field name ("" for errors about the whole form). */
export type FormErrors = Record<string, string[]>;

type Result<T = any> = { ok: boolean; status: number; data: T; errors: FormErrors };

function csrfToken(): string {
  if (import.meta.server) return "";
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function toErrors(body: any): FormErrors {
  const errors: FormErrors = {};
  // allauth: {errors: [{message, param}]}; DRF: {field: [msgs]} or {detail}
  if (Array.isArray(body?.errors)) {
    for (const e of body.errors) (errors[e.param || ""] ||= []).push(e.message);
  } else if (body && typeof body === "object") {
    for (const [key, value] of Object.entries(body)) {
      if (key === "detail") (errors[""] ||= []).push(String(value));
      else if (Array.isArray(value)) errors[key] = value.map(String);
    }
  }
  return errors;
}

async function call<T = any>(method: string, url: string, body?: object, headers: Record<string, string> = {}): Promise<Result<T>> {
  try {
    const response = await $fetch.raw<T>(url, {
      method: method as any,
      body,
      credentials: "same-origin",
      headers: { "X-CSRFToken": csrfToken(), ...headers },
      ignoreResponseError: true,
    });
    const data = response._data as any;
    const ok = response.status >= 200 && response.status < 300;
    return { ok, status: response.status, data, errors: ok ? {} : toErrors(data) };
  } catch {
    return { ok: false, status: 0, data: null as any, errors: { "": ["No se pudo conectar. Revisa tu conexión e intenta de nuevo."] } };
  }
}

export function useAuth() {
  const me = useState<Me | null>("auth-me", () => null);
  const checked = useState<boolean>("auth-checked", () => false);

  /** Who is signed in (also sets the CSRF cookie on the first visit). */
  async function refresh() {
    await call("GET", `${AUTH}/auth/session`);
    const result = await call<Me>("GET", "/djangoapi/me/");
    me.value = result.ok ? result.data : null;
    checked.value = true;
    return me.value;
  }

  async function ensureChecked() {
    if (!checked.value) await refresh();
    return me.value;
  }

  async function withCsrf<T>(fn: () => Promise<Result<T>>) {
    if (!csrfToken()) await call("GET", `${AUTH}/auth/session`);
    return fn();
  }

  return {
    me,
    checked,
    refresh,
    ensureChecked,

    async login(email: string, password: string) {
      const r = await withCsrf(() => call("POST", `${AUTH}/auth/login`, { email, password }));
      if (r.ok) await refresh();
      return r;
    },

    async signup(data: { public_name: string; email: string; password: string; accept_privacy: boolean; website: string }) {
      const r = await withCsrf(() => call("POST", `${AUTH}/auth/signup`, data));
      if (r.ok) await refresh();
      return r;
    },

    async logout() {
      await withCsrf(() => call("DELETE", `${AUTH}/auth/session`));
      me.value = null;
    },

    requestPasswordReset(email: string) {
      return withCsrf(() => call("POST", `${AUTH}/auth/password/request`, { email }));
    },

    /** Is a reset link still valid? */
    checkResetKey(key: string) {
      return call("GET", `${AUTH}/auth/password/reset`, undefined, { "X-Password-Reset-Key": key });
    },

    resetPassword(key: string, password: string) {
      return withCsrf(() => call("POST", `${AUTH}/auth/password/reset`, { key, password }));
    },

    changePassword(current_password: string, new_password: string) {
      return withCsrf(() => call("POST", `${AUTH}/account/password/change`, { current_password, new_password }));
    },

    checkEmailKey(key: string) {
      return call("GET", `${AUTH}/auth/email/verify`, undefined, { "X-Email-Verification-Key": key });
    },

    async verifyEmail(key: string) {
      const r = await withCsrf(() => call("POST", `${AUTH}/auth/email/verify`, { key }));
      if (r.ok || r.status === 401) await refresh();
      return r;
    },

    resendVerification(email: string) {
      return withCsrf(() => call("PUT", `${AUTH}/account/email`, { email }));
    },

    async updatePublicName(public_name: string) {
      const r = await withCsrf(() => call<Me>("PATCH", "/djangoapi/me/", { public_name }));
      if (r.ok) me.value = r.data;
      return r;
    },

    async claimAndinist(andinist: number, message: string) {
      const r = await withCsrf(() => call<Me>("POST", "/djangoapi/me/claim/", { andinist, message }));
      if (r.ok) me.value = r.data;
      return r;
    },

    /** Any other call to the site's API as the signed-in user (proposals...). */
    request<T = any>(method: string, url: string, body?: object) {
      return method === "GET" ? call<T>(method, url) : withCsrf(() => call<T>(method, url, body));
    },

    async cancelClaim() {
      const r = await withCsrf(() => call<Me>("DELETE", "/djangoapi/me/claim/"));
      if (r.ok) me.value = r.data;
      return r;
    },
  };
}
