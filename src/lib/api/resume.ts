import type { Resume } from "@/types";
import { ACCEPTED_RESUME_TYPES, MAX_RESUME_SIZE_BYTES } from "@/lib/constants";
import { ApiError, request, type RequestOptions } from "./client";
import { mapResume, type ApiResume } from "./mappers";
import { notifyStoreChanged } from "./store";

export async function getResumes(options?: RequestOptions): Promise<Resume[]> {
  const { resumes } = await request<{ resumes: ApiResume[] }>("/resumes", {}, options);
  return resumes.map(mapResume);
}

export async function getPrimaryResume(options?: RequestOptions): Promise<Resume | null> {
  const resumes = await getResumes(options);
  return resumes.find((item) => item.isPrimary) ?? null;
}

/**
 * V1 upload: client-side type/size validation, then metadata to the backend.
 * Real file storage + AI parsing land later behind the same signature.
 */
export async function uploadResume(file: File, options?: RequestOptions): Promise<Resume> {
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

  const { resume } = await request<{ resume: ApiResume }>(
    "/resumes",
    {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/pdf",
        isPrimary: true,
      }),
    },
    options,
  );
  notifyStoreChanged();
  return mapResume(resume);
}

export async function deleteResume(id: string, options?: RequestOptions): Promise<void> {
  await request(`/resumes/${id}`, { method: "DELETE" }, options);
  notifyStoreChanged();
}
