import type { PreparationStats, User, UserPreferences } from "@/types";
import { request, type RequestOptions } from "./client";
import { mapUser, mapInterview, type ApiInterview, type ApiPage, type ApiUser } from "./mappers";
import { notifyStoreChanged } from "./store";

/**
 * Preferences and profile extras (job title, target role) are not persisted
 * server-side yet; they are kept per-tab and merged into the mapped user so
 * the settings screens keep working unchanged.
 */
let localPatch: Partial<Pick<User, "jobTitle" | "targetRole">> = {};
let localPreferences: Partial<UserPreferences> = {};

function withLocal(user: User): User {
  return {
    ...user,
    ...localPatch,
    preferences: { ...user.preferences, ...localPreferences },
  };
}

export async function getCurrentUser(options?: RequestOptions): Promise<User> {
  const { user } = await request<{ user: ApiUser }>("/auth/me", {}, options);
  return withLocal(mapUser(user));
}

export async function getPreparationStats(options?: RequestOptions): Promise<PreparationStats> {
  // Derived from real interview data until a dedicated stats endpoint exists.
  const data = await request<ApiPage<ApiInterview>>(
    "/interviews?status=COMPLETED&pageSize=50",
    {},
    options,
  );
  const completed = data.items.map(mapInterview);
  const scored = completed.filter((item) => typeof item.score === "number");
  return {
    interviewsCompleted: data.total,
    averageScore: scored.length
      ? Math.round(scored.reduce((sum, item) => sum + (item.score ?? 0), 0) / scored.length)
      : 0,
    questionsPracticed: completed.reduce((sum, item) => sum + item.questionCount, 0),
    currentStreakDays: completed.length ? 1 : 0,
  };
}

export async function updateProfile(
  patch: Partial<Pick<User, "name" | "email" | "jobTitle" | "targetRole">>,
  options?: RequestOptions,
): Promise<User> {
  const { jobTitle, targetRole, name } = patch;
  localPatch = { ...localPatch, jobTitle, targetRole };

  const body: Record<string, unknown> = {};
  if (name !== undefined) body.name = name;
  // Email changes require verification and are intentionally not sent.

  const { user } = Object.keys(body).length
    ? await request<{ user: ApiUser }>(
        "/user/profile",
        { method: "PATCH", body: JSON.stringify(body) },
        options,
      )
    : await request<{ user: ApiUser }>("/auth/me", {}, options);

  notifyStoreChanged();
  return withLocal(mapUser(user));
}

export async function updatePreferences(
  patch: Partial<UserPreferences>,
  options?: RequestOptions,
): Promise<User> {
  localPreferences = { ...localPreferences, ...patch };
  const { user } = await request<{ user: ApiUser }>("/auth/me", {}, options);
  notifyStoreChanged();
  return withLocal(mapUser(user));
}

export async function signIn(
  email: string,
  password: string,
  options?: RequestOptions,
): Promise<User> {
  const { user } = await request<{ user: ApiUser }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    options,
  );
  notifyStoreChanged();
  return withLocal(mapUser(user));
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  options?: RequestOptions,
): Promise<User> {
  const { user } = await request<{ user: ApiUser }>(
    "/auth/signup",
    { method: "POST", body: JSON.stringify({ name, email, password }) },
    options,
  );
  notifyStoreChanged();
  return withLocal(mapUser(user));
}

export async function signOut(options?: RequestOptions): Promise<void> {
  await request("/auth/logout", { method: "POST" }, options);
  localPatch = {};
  localPreferences = {};
  notifyStoreChanged();
}
