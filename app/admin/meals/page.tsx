import AdminMealManager from "@/components/admin/AdminMealManager";
export default function AdminMeals() {
  return (
    <section className="shell form-page">
      <span className="kicker">Admin · catalog</span>
      <h1 style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>Shape the menu.</h1>
      <AdminMealManager />
    </section>
  );
}
