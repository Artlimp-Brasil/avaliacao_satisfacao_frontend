import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";

interface EvaluationButtonProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactElement;
  onClick: () => void;
  className?: string;
  iconSize?: string; // Ex: "w-24 h-24"
}

export const EvaluationButton = ({
  title,
  subtitle,
  icon,
  onClick,
  className,
  iconSize = "w-20 h-20",
}: EvaluationButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-40 w-full max-w-xs bg-gradient-card shadow-card hover:shadow-soft",
        "border-border hover:border-primary/30 transition-all duration-300",
        "flex flex-col items-center justify-center text-center space-y-3 px-2",
        "hover:scale-105 hover:bg-primary/5",
        className
      )}
    >
      {/* Ícone */}
      {icon && (
        <div className="text-primary flex items-center justify-center">
          {React.cloneElement(icon, { className: cn(icon.props.className, iconSize) })}
        </div>
      )}

      {/* Título e subtítulo */}
      <div className="flex flex-col items-center text-center">
        <span className="font-medium text-lg leading-snug break-words">{title}</span>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
      </div>
    </Button>
  );
};
