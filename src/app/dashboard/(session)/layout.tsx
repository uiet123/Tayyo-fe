/**
 * Full-bleed layout for the live interview room. Deliberately excludes the
 * dashboard sidebar and topbar so the session owns the whole viewport.
 */
export default function InterviewSessionLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-dvh overflow-hidden">{children}</div>;
}
