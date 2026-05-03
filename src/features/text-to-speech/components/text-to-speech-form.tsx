'use client';

import { z } from "zod";
import { formOptions } from "@tanstack/react-form";

import { useAppForm } from "@/hooks/use-app-form";

const ttsFormSchema = z.object({
    text: z.string().min(1, "Please enter some text"),
    voiceId: z.string().min(1, "Please select a voice"),
    temperature: z.number(),
    topP: z.number(),
    topK: z.number(),
    repetitionPenalty: z.number(),
});

export type TtsFormSchema = z.infer<typeof ttsFormSchema>;

export const defaultTTSValues: TtsFormSchema = {
    text: "",
    voiceId: "",
    temperature: 0.8,
    topP: 0.95,
    topK: 1000,
    repetitionPenalty: 1.2,
};

export const ttsFormOptions = formOptions({
    defaultValues: defaultTTSValues,
});

export function TextToSpeechForm({
    children,
    defaultValues,
}: {
    children: React.ReactNode;
    defaultValues?: TtsFormSchema;
}) {
    const form = useAppForm({
        ...ttsFormOptions,
        defaultValues: defaultValues ?? defaultTTSValues,
        validators: {
            onSubmit: ttsFormSchema,
        },
        onSubmit: async () => {
            // Generation logic goes here
        },
    });
    return <form.AppForm>{children}</form.AppForm>;
}