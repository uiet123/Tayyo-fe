import type { PreparationStats, User, UserPreferences } from "@/types";
import { mockPreparationStats } from "@/lib/mock/user";
import { request, type RequestOptions } from "./client";
import { notifyStoreChanged, store } from "./store";

export function getCurrentUser(options?: RequestOptions): Promise<User> {
  return request(() => ({ ...store.user }), options);
}

export function getPreparationStats(options?: RequestOptions): Promise<PreparationStats> {
  return request(() => mockPreparationStats, options);
}

export function updateProfile(
  patch: Partial<Pick<User, "name" | "email" | "jobTitle" | "targetRole">>,
  options?: RequestOptions,
): Promise<User> {
  return request(() => {
    store.user = { ...store.user, ...patch };
    notifyStoreChanged();
    return { ...store.user };
  }, options);
}

export function updatePreferences(
  patch: Partial<UserPreferences>,
  options?: RequestOptions,
): Promise<User> {
  return request(() => {
    store.user = { ...store.user, preferences: { ...store.user.preferences, ...patch } };
    notifyStoreChanged();
    return { ...store.user };
  }, options);
}

/** Auth is not implemented. These exist so screens can be wired end to end. */
export function signIn(email: string, _password: string, options?: RequestOptions) {
  return request(() => ({ ...store.user, email }), options);
}

export function signUp(name: string, email: string, _password: string, options?: RequestOptions) {
  return request(() => {
    store.user = { ...store.user, name, email };
    return { ...store.user };
  }, options);
}

export function signOut(options?: RequestOptions): Promise<void> {
  return request(() => undefined, { latencyMs: 300, ...options });
}
