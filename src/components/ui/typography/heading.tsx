import { twMerge } from "tailwind-merge";

export function TypographyHeading({
  className,
  children,
  level,
  ...props
}: React.BaseHTMLAttributes<HTMLHeadingElement> & {
  level: 1 | 2 | 3 | 4;
}) {
  switch (level) {
    case 1:
      return (
        <h1
          {...props}
          className={twMerge([
            "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
            className,
          ])}
        >
          {children}
        </h1>
      );
    case 2:
      return (
        <h2
          {...props}
          className={twMerge([
            "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
            className,
          ])}
        >
          {children}
        </h2>
      );
    case 3:
      return (
        <h3
          {...props}
          className={twMerge([
            "scroll-m-20 text-2xl font-semibold tracking-tight",
            className,
          ])}
        >
          {children}
        </h3>
      );
    case 4:
      return (
        <h4
          {...props}
          className={twMerge([
            "scroll-m-20 text-xl font-semibold tracking-tight",
            className,
          ])}
        >
          {children}
        </h4>
      );
    default:
      break;
  }
}
