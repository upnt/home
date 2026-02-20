import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type Options = {
  basePath: string; // 例: `${BASE_URL}phasmophobia` / `${BASE_URL}math`
  otherBases?: Record<string, string>; // 例: { math: `${BASE_URL}math`, phasmo: `${BASE_URL}phasmophobia` }
};

export const remarkWikiLinks: Plugin<[Options]> = (opts) => {
  const base = opts.basePath.replace(/\/+$/, "");
  const other = opts.otherBases ?? {};

  const normalizeSlug = (s: string) => s.trim().replace(/^\/+|\/+$/g, "");

  return (tree) => {
    visit(tree, "text", (node: any, index: number | null, parent: any) => {
      if (!parent || typeof node.value !== "string" || index == null) return;

      const value: string = node.value;
      const re = /\[\[([^\]]+)\]\]/g;

      let match: RegExpExecArray | null;
      let last = 0;
      const parts: any[] = [];

      while ((match = re.exec(value)) !== null) {
        const before = value.slice(last, match.index);
        if (before) parts.push({ type: "text", value: before });

        const raw = match[1].trim();

        // [[math:...]] / [[phasmo:...]] の prefix
        const prefixed = raw.match(/^([a-zA-Z0-9_-]+):(.*)$/);

        let urlBase = base;
        let slugPart = raw;

        if (prefixed) {
          const key = prefixed[1];
          const rest = prefixed[2];
          if (other[key]) {
            urlBase = other[key].replace(/\/+$/, "");
            slugPart = rest;
          }
        }

        const slug = normalizeSlug(slugPart);

        parts.push({
          type: "link",
          url: `${urlBase}/${slug}/`,
          data: { hProperties: { class: "internal" } },
          children: [{ type: "text", value: raw }],
        });

        last = match.index + match[0].length;
      }

      const after = value.slice(last);
      if (after) parts.push({ type: "text", value: after });

      if (parts.length) parent.children.splice(index, 1, ...parts);
    });
  };
};
