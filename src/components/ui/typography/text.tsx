import { twMerge } from "tailwind-merge";

export function TypographyText({
  className,
  children,
  ...props
}: React.BaseHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props} className={twMerge([className, "leading-7"])}>
      {children}
    </p>
  );
}
