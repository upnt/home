import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  phasmoWiki: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./wiki/phasmophobia" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      updated: z.string(), // "YYYY-MM-DD"
      draft: z.boolean().default(false),
    }),
  }),
};
