import type { PublicSection } from "@/lib/public-pages";

type ContentItem = { title?: string; heading?: string; label?: string; description?: string; body?: string; value?: string };
function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
function itemsValue(value: unknown): ContentItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ContentItem => item !== null && typeof item === "object" && !Array.isArray(item));
}

export function PublicPageSections({ sections }: { sections: PublicSection[] }) {
  return <div className="public-cms-sections">
    {sections.map((section) => {
      const content = section.content;
      const eyebrow = stringValue(content.eyebrow);
      const heading = stringValue(content.heading);
      const body = stringValue(content.body);
      const lead = stringValue(content.lead);
      const items = itemsValue(content.items);
      const type = section.section_type;

      if (!heading && !body && !lead && items.length === 0) return null;

      if (type === "feature-grid" || type === "cards") {
        return <section className="public-cms-section section-wrap" key={section.id}>
          {eyebrow && <p className="eyebrow dark-eyebrow">{eyebrow}</p>}
          {heading && <h2 className="public-cms-heading">{heading}</h2>}
          {lead && <p className="public-cms-lead">{lead}</p>}
          <div className="public-cms-card-grid">
            {items.map((item, index) => <article className="public-cms-card" key={index}>
              <span className="division-number">{String(index + 1).padStart(2, "0")}</span>
              {(item.title || item.heading) && <h3>{item.title || item.heading}</h3>}
              {(item.description || item.body) && <p>{item.description || item.body}</p>}
            </article>)}
          </div>
        </section>;
      }

      if (type === "list") {
        return <section className="public-cms-section section-wrap" key={section.id}>
          {eyebrow && <p className="eyebrow dark-eyebrow">{eyebrow}</p>}
          {heading && <h2 className="public-cms-heading">{heading}</h2>}
          {lead && <p className="public-cms-lead">{lead}</p>}
          <ul className="public-cms-list">{items.map((item, index) => <li key={index}>
            <span className="division-number">{String(index + 1).padStart(2, "0")}</span>
            <div>{(item.title || item.heading || item.label) && <strong>{item.title || item.heading || item.label}</strong>}
              {(item.description || item.body || item.value) && <p>{item.description || item.body || item.value}</p>}</div>
          </li>)}</ul>
        </section>;
      }

      if (type === "call-to-action" || type === "cta") {
        return <section className="public-cms-cta section-wrap" key={section.id}>
          <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}{heading && <h2>{heading}</h2>}{body && <p>{body}</p>}</div>
        </section>;
      }

      return <section className="public-cms-section section-wrap" key={section.id}>
        {eyebrow && <p className="eyebrow dark-eyebrow">{eyebrow}</p>}
        {heading && <h2 className="public-cms-heading">{heading}</h2>}
        {lead && <p className="public-cms-lead">{lead}</p>}
        {body && <div className="public-cms-body">{body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}
        {items.length > 0 && <div className="public-cms-card-grid">
          {items.map((item, index) => <article className="public-cms-card" key={index}>
            <span className="division-number">{String(index + 1).padStart(2, "0")}</span>
            {(item.title || item.heading || item.label) && <h3>{item.title || item.heading || item.label}</h3>}
            {(item.description || item.body || item.value) && <p>{item.description || item.body || item.value}</p>}
          </article>)}
        </div>}
      </section>;
    })}
  </div>;
}
