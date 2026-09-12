import Link from "next/link";
export default function Offline() {
  return (
    <section className="shell form-page">
      <span className="kicker">Connection paused</span>
      <h1 style={{ fontSize: "clamp(3rem,8vw,6rem)" }}>
        The kitchen is still here.
      </h1>
      <p className="lede">
        Reconnect to refresh the menu and continue your order.
      </p>
      <Link className="button" href="/">
        Try again
      </Link>
    </section>
  );
}
