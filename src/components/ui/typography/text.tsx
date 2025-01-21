import { twMerge } from "tailwind-merge";

export function TypographyText({
  className,
  children,
  ...props
}: React.BaseHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={twMerge([
        "text-tBase dark:text-tBaseDark leading-7 [&:not(:first-child)]:mt-6",
        className,
      ])}
    >
      {children}
    </p>
  );
}
