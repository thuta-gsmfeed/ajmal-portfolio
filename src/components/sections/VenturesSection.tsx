export function VenturesSection() {
  return (
    <section
      id="ventures"
      data-header-theme="light"
      className="ventures-showcase ventures-showcase--intro"
      aria-labelledby="ventures-title"
    >
      <div className="container ventures-showcase__inner">
        <header className="ventures-showcase__header">
          <h2 id="ventures-title" data-section-reveal="up">Our Ventures</h2>
          <p data-section-reveal="up" data-reveal-order="1"><strong>Businesses built from experience.</strong></p>
          <p data-section-reveal="up" data-reveal-order="2">What started with entrepreneurship and commerce has grown into a portfolio of companies serving different markets.</p>
          <p data-section-reveal="up" data-reveal-order="3">Today, Gholzad&apos;s ventures bring together global electronics distribution, AI-powered trading, business automation, and luxury experiences.</p>
        </header>
      </div>
    </section>
  );
}
