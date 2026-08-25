/**
 * The only module the UI imports for data.
 *
 * Swapping mocks for the real backend means changing the implementations in
 * this folder. No component, hook or page needs to be touched.
 */
export * from "./client";
export * as interviewsApi from "./interviews";
export * as creditsApi from "./credits";
export * as resumeApi from "./resume";
export * as userApi from "./user";
export { subscribeToStore } from "./store";
