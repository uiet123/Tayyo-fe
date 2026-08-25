import type { Resume } from "@/types";
import { ACCEPTED_RESUME_TYPES, MAX_RESUME_SIZE_BYTES } from "@/lib/constants";
import { mockResume } from "@/lib/mock/resume";
import { ApiError, request, type RequestOptions } from "./client";
import { notifyStoreChanged, store } from "./store";

export function getResumes(options?: RequestOptions): Promise<Resume[]> {
  return request(() => [...store.resumes], options);
}

export function getPrimaryResume(options?: RequestOptions): Promise<Resume | null> {
  return request(() => store.resumes.find((item) => item.isPrimary) ?? null, options);
}

/**
 * Upload is simulated. Real parsing will run server-side and flip `status`
 * from "processing" to "ready" once insights are available.
 */
export function uploadResume(file: File, options?: RequestOptions): Promise<Resume> {
  return request(() => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!ACCEPTED_RESUME_TYPES.includes(extension as (typeof ACCEPTED_RESUME_TYPES)[number])) {
      throw new ApiError(
        `Unsupported file type. Upload a ${ACCEPTED_RESUME_TYPES.join(", ")} file.`,
        415,
        "UNSUPPORTED_FILE_TYPE",
      );
    }
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      throw new ApiError("File is larger than 5 MB.", 413, "FILE_TOO_LARGE");
    }

    const resume: Resume = {
      id: `res_${Math.random().toString(36).slice(2, 8)}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || "application/pdf",
      uploadedAt: new Date().toISOString(),
      status: "ready",
      isPrimary: true,
      insights: mockResume.insights,
    };

    store.resumes = [resume, ...store.resumes.map((item) => ({ ...item, isPrimary: false }))];
    notifyStoreChanged();
    return resume;
  }, { latencyMs: 1200, ...options });
}

export function deleteResume(id: string, options?: RequestOptions): Promise<void> {
  return request(() => {
    const exists = store.resumes.some((item) => item.id === id);
    if (!exists) throw new ApiError("Resume not found.", 404, "RESUME_NOT_FOUND");
    store.resumes = store.resumes.filter((item) => item.id !== id);
    if (store.resumes.length && !store.resumes.some((item) => item.isPrimary)) {
      store.resumes[0].isPrimary = true;
    }
    notifyStoreChanged();
  }, options);
}
