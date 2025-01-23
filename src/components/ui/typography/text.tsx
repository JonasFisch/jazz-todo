import { twMerge } from "tailwind-merge";

export function TypographyText({
  className,
  children,
  ...props
}: React.BaseHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props} className={twMerge(["leading-7", className])}>
      {children}
    </p>
  );
}
