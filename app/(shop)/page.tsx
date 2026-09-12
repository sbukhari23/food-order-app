import MealExplorer from "@/components/meals/MealExplorer";

export default function Home() {
  return (
    <>
      <section className="shell hero">
        <div>
          <span className="kicker">Dinner, considered</span>
          <h1>Good food has a point of view.</h1>
          <p className="lede">
            From crisp-edged classics to bowls with a little more color,
            ReactFood is a small menu for nights that deserve better than
            default.
          </p>
        </div>
        <div className="hero-note">
          Our kitchen works in contrasts: slow sauces, bright herbs, and just
          enough heat to keep the conversation going.
        </div>
      </section>
      <div className="shell section-head">
        <div>
          <span className="kicker">The menu</span>
          <h2>Find your next favorite</h2>
        </div>
        <span className="muted">Freshly composed • delivered with care</span>
      </div>
      <MealExplorer />
    </>
  );
}
