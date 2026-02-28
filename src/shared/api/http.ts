import { clearAccessToken, getAccessToken, setAccessTokenPreserveStorage } from "@/features/auth/utils/storage";
import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;

function setAuthHeader(cfg: InternalAxiosRequestConfig, rawToken: string) {
    const value = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
    const h = (cfg.headers ??= new AxiosHeaders());

    if (h instanceof AxiosHeaders) {
        h.set('Authorization', value);
    } else {
        (h as Record<string, string>)['Authorization'] = value;
    }
}

export const http = axios.create({
    baseURL,
    withCredentials: true,
});

let refreshing: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
    const task = (async () => {
        try {
            const { data } = await axios.post<{ accessToken: string }>(
                `${baseURL}/auth/refresh`,
                null,
                { withCredentials: true }
            );

            if (data?.accessToken) {
                setAccessTokenPreserveStorage(data.accessToken);
                return data.accessToken;
            }

            return null;
        } catch {
            return null;
        }
    })();

    refreshing = task.finally(() => { refreshing = null; });
    return task;
}

http.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) setAuthHeader(config, token);
    return config;
});

http.interceptors.response.use(
    (res) => res,
    async (err: AxiosError<{ message?: string }>) => {
        const res = err.response;
        const cfg = (err.config || {}) as InternalAxiosRequestConfig & { _retry?: boolean };

        const serverMessage = res?.data?.message;
        if (serverMessage) err.message = serverMessage;

        if (cfg.url?.includes('/auth/refresh')) {
            clearAccessToken();
            throw err;
        }

        const shouldRefresh = !!res && (res.status === 401 || res.status === 419);
        if (!shouldRefresh || cfg._retry) throw err;

        cfg._retry = true;

        const token = await (refreshing ?? refreshToken());
        if (!token) {
            clearAccessToken();
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.assign('/login');
            }
            return Promise.reject(err);
        }

        setAuthHeader(cfg, token);
        return http(cfg);
    }
);