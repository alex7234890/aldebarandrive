import * as React from "react";
import { cn } from "@/lib/utils";

const Alert = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = ({ className, ...props }) => (
  <h5
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = ({ className, ...props }) => (
  <div
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
