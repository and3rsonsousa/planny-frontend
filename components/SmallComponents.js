export function StepName({ step }) {
  return (
    <span
      className={`py-1 px-2 inline-block rounded-lg ${step.slug}-bg text-xx uppercase font-bold tracking-wide `}
    >
      {step.name}
    </span>
  );
}
