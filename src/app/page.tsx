import Link from "next/link";
import { divisions, primaryNavigation } from "@/lib/site";

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="NSOMEX Group home">
          <span className="brand-mark">N</span>
          <span className="brand-name">
            NSOMEX<span>GROUP</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {primaryNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="header-cta" href="/contact">
          Let&apos;s connect <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">
            <span className="eyebrow-line" /> A GLOBAL BUSINESS GROUP
          </p>
          <h1>
            Connecting global business
            <br />
            to <span>global opportunity.</span>
          </h1>
          <p className="hero-copy">
            We bring together technology, engineering, renewable energy, and
            global business to help organizations access opportunity and move
            forward with confidence.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/divisions">
              Explore our divisions <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/about">
              Discover NSOMEX <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="hero-aside" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="orbit orbit-three" />
          <span className="orbit-core">N</span>
          <span className="orbit-caption">CONNECTED BY PURPOSE</span>
        </div>
        <div className="hero-footer">
          <span>INTEGRATED CAPABILITIES</span>
          <span>BUILT FOR A CONNECTED WORLD</span>
        </div>
      </section>

      <section className="intro section-wrap">
        <div>
          <p className="eyebrow dark-eyebrow">WHO WE ARE</p>
          <h2>
            One group.
            <br />
            <span>Multiple capabilities.</span>
            <br />
            Shared ambition.
          </h2>
        </div>
        <div className="intro-copy">
          <p>
            NSOMEX Group is a technology-driven global business company
            connecting businesses, products, services, talent, and opportunities
            across markets.
          </p>
          <p>
            Operating across complementary sectors, we focus on trust,
            distribution, technology, and execution—helping organizations
            navigate complexity and pursue sustainable growth.
          </p>
          <Link className="text-link dark-link" href="/about">
            More about the group <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="divisions-section">
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR DIVISIONS</p>
              <h2>Expertise across connected industries.</h2>
            </div>
            <p>
              Four focused divisions. A shared commitment to creating value
              across markets.
            </p>
          </div>

          <div className="division-grid">
            {divisions.map((division) => (
              <article className="division-card" key={division.slug}>
                <div className="division-card-top">
                  <span className="division-number">{division.number}</span>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </div>
                <h3>{division.name}</h3>
                <p>{division.summary}</p>
                <ul>
                  {division.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link
                  className="card-link"
                  href={`/divisions/${division.slug}`}
                  aria-label={`Explore ${division.name}`}
                >
                  Explore division <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta section-wrap">
        <p className="eyebrow dark-eyebrow">LET&apos;S MOVE FORWARD</p>
        <div className="closing-row">
          <h2>
            Opportunity begins
            <br />
            with a <span>connection.</span>
          </h2>
          <Link className="button button-dark" href="/contact">
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark">N</span>
          <span className="brand-name">
            NSOMEX<span>GROUP</span>
          </span>
        </Link>
        <p>Connecting Global Business to Global Opportunity.</p>
        <span>© {new Date().getFullYear()} NSOMEX Group. All rights reserved.</span>
      </footer>
    </main>
  );
}
