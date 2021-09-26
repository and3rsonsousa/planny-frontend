export default function Logo({ negative }) {
  return (
    <h3 className="text-2xl font-extrabold">
      <span className={negative ? `text-white` : "text-brand-600"}>Plan</span>
      <span className="text-accent-400">ny</span>
    </h3>
  );
}
