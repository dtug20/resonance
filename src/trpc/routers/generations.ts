import * as Sentry from '@sentry/node';
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { uploadAudio } from "@/lib/r2";
import { detectLanguage, isMixedLanguage } from "@/lib/language-detection";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { createTRPCRouter, orgProcedure } from "../init";

export const generationsRouter = createTRPCRouter({
    getById: orgProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const generation = await prisma.generation.findUnique({
                where: {
                    id: input.id,
                    orgId: ctx.orgId,
                },
                omit: {
                    orgId: true,
                },
            });

            if (!generation) throw new TRPCError({ code: "NOT_FOUND" });

            return {
                ...generation,
                audioUrl: `${env.NEXT_PUBLIC_R2_PUBLIC_URL}/${generation.r2ObjectKey}`,
            };
        }),

    getAll: orgProcedure.query(async ({ ctx }) => {
        const generations = await prisma.generation.findMany({
            where: { orgId: ctx.orgId },
            orderBy: { createdAt: "desc" },
            omit: {
                orgId: true,
                r2ObjectKey: true,
            },
        });

        return generations;
    }),

    create: orgProcedure
        .input(
            z.object({
                text: z.string().min(1).max(TEXT_MAX_LENGTH),
                voiceId: z.string().min(1),
                temperature: z.number().min(0).max(2).default(0.8),
                topP: z.number().min(0).max(1).default(0.95),
                topK: z.number().min(1).max(10000).default(1000),
                repetitionPenalty: z.number().min(1).max(2).default(1.2),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const voice = await prisma.voice.findUnique({
                where: {
                    id: input.voiceId,
                    OR: [
                        { variant: "SYSTEM" },
                        { variant: "CUSTOM", orgId: ctx.orgId, }
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    r2ObjectKey: true,
                },
            });

            if (!voice) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Voice not found"
            });

            if (!voice.r2ObjectKey) {
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: "Voice is not available.",
                });
            }

            // ── Language detection (server-side, authoritative) ─────────────
            const detectedLang = detectLanguage(input.text);
            const isMixed = isMixedLanguage(input.text);
            const useViterbox = detectedLang === "vi";

            Sentry.logger.info("Generation started", {
                orgId: ctx.orgId,
                voiceId: input.voiceId,
                textLength: input.text.length,
                engine: useViterbox ? "viterbox" : "chatterbox",
                detectedLang,
                isMixed,
            });

            // ── Route to the correct TTS service ────────────────────────────
            const audioBuffer = useViterbox
                ? await callViterbox(input.text, voice.r2ObjectKey, input)
                : await callChatterbox(input.text, voice.r2ObjectKey, input);

            const buffer = Buffer.from(audioBuffer);
            let generationId: string | null = null;
            let r2ObjectKey: string | null = null;

            try {
                const generation = await prisma.generation.create({
                    data: {
                        orgId: ctx.orgId,
                        text: input.text,
                        voiceName: voice.name,
                        voiceId: voice.id,
                        engine: useViterbox ? "viterbox" : "chatterbox",
                        detectedLang,
                        temperature: input.temperature,
                        topP: input.topP,
                        topK: input.topK,
                        repetitionPenalty: input.repetitionPenalty,
                    },
                    select: {
                        id: true,
                    },
                });

                generationId = generation.id;
                r2ObjectKey = `generations/orgs/${ctx.orgId}/${generation.id}`;

                await uploadAudio({
                    buffer,
                    key: r2ObjectKey,
                });

                await prisma.generation.update({
                    where: { id: generationId },
                    data: { r2ObjectKey },
                });

                Sentry.logger.info("Audio generated", {
                    orgId: ctx.orgId,
                    generationId: generation.id,
                    engine: useViterbox ? "viterbox" : "chatterbox",
                    detectedLang,
                });
            } catch {
                if (generationId) {
                    await prisma.generation
                        .delete({
                            where: { id: generationId },
                        })
                        .catch(() => { });
                }

                Sentry.logger.error("Generation failed", {
                    orgId: ctx.orgId,
                    voiceId: input.voiceId,
                    engine: useViterbox ? "viterbox" : "chatterbox",
                });

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to store generated audio",
                });
            }

            if (!generationId || !r2ObjectKey) throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to store generated audio",
            });

            return { id: generationId };
        }),
});

// ── Chatterbox Turbo (English-optimized) ────────────────────────────────────
async function callChatterbox(
    text: string,
    voiceKey: string,
    params: { temperature: number; topP: number; topK: number; repetitionPenalty: number },
): Promise<ArrayBuffer> {
    const res = await fetch(`${env.CHATTERBOX_API_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": env.CHATTERBOX_API_KEY,
        },
        body: JSON.stringify({
            prompt: text,
            voice_key: voiceKey,
            temperature: params.temperature,
            top_p: params.topP,
            top_k: params.topK,
            repetition_penalty: params.repetitionPenalty,
            norm_loudness: true,
        }),
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Chatterbox error ${res.status}: ${detail}`,
        });
    }

    return res.arrayBuffer();
}

// ── Viterbox (Vietnamese + code-switching) ──────────────────────────────────
async function callViterbox(
    text: string,
    voiceKey: string,
    params: { temperature: number; topP: number; repetitionPenalty: number },
): Promise<ArrayBuffer> {
    const res = await fetch(`${env.VITERBOX_API_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": env.CHATTERBOX_API_KEY, // shared API key
        },
        body: JSON.stringify({
            prompt: text,
            voice_key: voiceKey,
            // "vi" instructs Viterbox to treat text as Vietnamese-primary.
            // English words are handled via code-switching.
            language: "vi",
            exaggeration: 0.5,
            cfg_weight: 0.5,
            // Viterbox enforces temperature <= 1.0 and top_p <= 1.0,
            // while Chatterbox allows higher values — clamp here.
            temperature: Math.min(params.temperature, 1.0),
            top_p: Math.min(params.topP, 1.0),
            repetition_penalty: params.repetitionPenalty,
            sentence_pause_ms: 500,
            crossfade_ms: 50,
        }),
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Viterbox error ${res.status}: ${detail}`,
        });
    }

    return res.arrayBuffer();
}

