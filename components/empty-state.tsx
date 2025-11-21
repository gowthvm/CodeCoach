import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description: string
    className?: string
    children?: React.ReactNode
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    className,
    children,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center p-8 animate-in fade-in-50",
                className
            )}
        >
            {Icon && (
                <div className="bg-muted/30 rounded-full p-4 mb-4">
                    <Icon className="h-8 w-8 text-muted-foreground/50" />
                </div>
            )}
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {description}
            </p>
            {children && <div className="mt-4">{children}</div>}
        </div>
    )
}
