import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SettingsSectionProps {
  id?: string;
  title: string;
  description: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function SettingsSection({
  id,
  title,
  description,
  footer,
  children,
}: SettingsSectionProps) {
  return (
    <Card id={id} className="scroll-mt-24 overflow-hidden">
      <div className="p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6">{children}</div>
      </div>

      {footer ? (
        <>
          <Separator />
          <div className="flex items-center justify-end gap-3 bg-muted/40 px-5 py-3.5 sm:px-6">
            {footer}
          </div>
        </>
      ) : null}
    </Card>
  );
}
