export default function Loading() {
  return (
    <section className="shell form-page" aria-label="Loading">
      <div className="grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="card skeleton" key={index} />
        ))}
      </div>
    </section>
  );
}
