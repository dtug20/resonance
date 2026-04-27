import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { QuickAction } from "../data/quick-action";
import { cn } from "@/lib/utils";

type QuickActionCardProps = QuickAction;

export function QuickActionCard({
    title,
    description,
    gradient,
    href,
}: QuickActionCardProps) {
    return (
        <div className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className={cn(
                "relative h-[110px] w-[150px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br",
                gradient
            )}
            >
                {/* Decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-12 rounded-full bg-white/30" />
                </div>
                <div className="absolute inset-1.5 rounded-lg ring-1 ring-inset ring-white/40" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between py-0.5">
                <div className="space-y-1.5">
                    <h3 className="text-[15px] font-semibold leading-none">{title}</h3>
                    <p className="text-[13px] text-muted-foreground leading-snug">
                        {description}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-fit h-8 px-3 text-xs shadow-none"
                    asChild
                >
                    <Link href={href}>
                        Try now
                        <ArrowRight className="size-3.5 ml-1" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};