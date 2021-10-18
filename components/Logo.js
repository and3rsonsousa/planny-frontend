export default function Logo({ negative }) {
  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-0">
        <span className={negative ? `text-white` : "text-brand-600"}>Plan</span>
        <span className="text-accent-400">ny</span>
      </h1>
      {/* <h1 className="text-2xl font-bold absolute inset-0">
        <span className="text-idea-400">P</span>
        <span className="text-do-400">l</span>
        <span className="text-doing-400">a</span>
        <span className="text-review-400">n</span>
        <span className="text-done-400">n</span>
        <span className="text-accomplished-400">y</span>
      </h1> */}
    </div>
  );
}
