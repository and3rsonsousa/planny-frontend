export default function Action({ action }) {
  return (
    <div
      className={`py-1 px-2 mt-1 rounded-lg text-xs bg-gray-100 line-clamp-1 ${action.status.slug}-bg`}
    >
      {action.name}
    </div>
  );
}
