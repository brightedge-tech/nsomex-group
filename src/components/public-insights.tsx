import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { PublicArticle } from "@/lib/public-articles";
import styles from "./public-insights.module.css";

type Props = { locale: Locale; articles: PublicArticle[]; emptyMessage: string };

export function PublicInsights({ locale, articles, emptyMessage }: Props) {
  const copy = locale === "fr"
    ? { read: "Lire l'article", date: (value: string) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(value)), featured: "À la une" }
    : { read: "Read article", date: (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(value)), featured: "Featured" };

  if (!articles.length) return <p className={styles.empty}>{emptyMessage}</p>;

  return (
    <div className={styles.grid}>
      {articles.map((article) => (
        <article className={styles.card} key={article.id}>
          <Link className={styles.cardLink} href={`/${locale}/insights/${article.slug}`}>
            {article.cover_url ? (
              <div className={styles.cover}>
                <Image src={article.cover_url} alt="" fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" unoptimized />
              </div>
            ) : <div className={styles.coverFallback} aria-hidden="true"><span>NSOMEX / INSIGHTS</span></div>}
            <div className={styles.cardBody}>
              <div className={styles.meta}>
                <time dateTime={article.published_at}>{copy.date(article.published_at)}</time>
                {article.is_featured && <span>{copy.featured}</span>}
              </div>
              <h2>{article.title}</h2>
              {article.excerpt && <p>{article.excerpt}</p>}
              <span className={styles.read}>{copy.read} <span aria-hidden="true">↗</span></span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function PublicArticleBody({ body }: { body: Record<string, unknown> }) {
  const blocks = Array.isArray(body.blocks) ? body.blocks : [];

  return (
    <div className={styles.articleBody}>
      {blocks.map((raw, index) => {
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
        const block = raw as Record<string, unknown>;
        const type = typeof block.type === "string" ? block.type : "";
        const text = typeof block.text === "string" ? block.text : "";

        if (type === "heading" && text.trim()) return <h2 key={index}>{text}</h2>;
        if (type === "paragraph" && text.trim()) return <p key={index}>{text}</p>;
        if (type === "quote" && text.trim()) return <blockquote key={index}>{text}</blockquote>;
        if (type === "list" && Array.isArray(block.items)) {
          const items = block.items.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
          if (items.length) return <ul key={index}>{items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>;
        }
        return null;
      })}
    </div>
  );
}
