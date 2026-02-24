import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  gameWiki: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./wiki/game" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      updated: z.string(), // "YYYY-MM-DD"
      draft: z.boolean().default(false),
    }),
  }),
  labWiki: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./wiki/lab" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      updated: z.string(), // "YYYY-MM-DD"
      draft: z.boolean().default(false),
    }),
  }),
};
