'use client';

import { useState } from "react";
import { Coins } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { TEXT_MAX_LENGTH, COST_PER_UNIT } from "@/features/text-to-speech/data/constants";

export function TextInputPanel() {
    const [text, setText] = useState("");

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            {/* Text input area */}
            <div className="relative min-h-0 flex-1">
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing or paste your text here..."
                    className="absolute inset-0 resize-none border-0 bg-transparent p-4 pb-6 lg:p-6 lg:pb-8 text-base! leading-relaxed tracking-tight shadow-none wrap-break-word focus-visible:ring-0"
                    maxLength={TEXT_MAX_LENGTH}
                />

                {/* Bottom fade overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
            </div>
            {/* Action Bar */}
            <div className="shrink-0 p-4 lg:p-6">
                {/* Mobile layout */}
                <div className="flex flex-col gap-3 lg:hidden">
                    <Button className="w-full">Generate Speech</Button>
                </div>
                {/* Desktop layout */}
                {text.length > 0 ? (
                    <div className="hidden items-center justify-between lg:flex">
                        <Badge variant="outline" className="gap-1.5 border-dashed">
                            <Coins className="size-3 text-chart-5" />
                            <span className="text-xs">
                                <span className="tabular-nums">
                                    ${(text.length * COST_PER_UNIT).toFixed(4)}
                                </span>&nbsp;
                                estimated
                            </span>
                        </Badge>
                        <div className="flex items-center gap-3">
                            <p className="text-xs tracking-tight">
                                {text.length.toLocaleString()}
                                <span className="text-muted-foreground">
                                    &nbsp;/&nbsp;{TEXT_MAX_LENGTH.toLocaleString()}
                                    &nbsp;characters
                                </span>
                            </p>
                            <Button size="sm">Generate speech</Button>
                        </div>
                    </div>
                ) : (
                    <div className="hidden lg:block">
                        <p className="text-sm text-muted-foreground">
                            Get started by typing or pasting your text above
                        </p>

                    </div>
                )}
            </div>
        </div>
    );
}