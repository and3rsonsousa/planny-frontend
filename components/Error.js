export default function Error({ children }) {
  return (
    <div className="p-8 text-red-400 bg-red-900 rounded-2xl mb-12">
      <pre>{children}</pre>
    </div>
  );
}
