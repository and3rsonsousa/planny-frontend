export default function Avatar({
  avatar,
  small = false,
  medium = false,
  smallest = false,
  border = false,
  className,
}) {
  return avatar ? (
    <div className={className ? className : null}>
      <div
        className={` ${
          smallest
            ? "w-4 h-4 text-xx"
            : small
            ? "w-6 h-6 text-xs"
            : medium
            ? "w-9 h-9 text-sm"
            : "w-14 h-14 text-base"
        } rounded-full overflow-hidden font-bold bg-neutral-2 text-neutral-4 flex justify-center items-center${
          border ? " ring-2 ring-white" : ""
        }`}
        style={avatar.colors ? { backgroundColor: avatar.colors[0].hex } : null}
      >
        {avatar.image ? (
          <img
            src={avatar.image.url}
            title={avatar.name}
            className="w-full h-full object-fit"
          />
        ) : (
          <span style={avatar.colors ? { color: avatar.colors[1].hex } : null}>
            {avatar.name
              ? avatar.name.substr(0, smallest || small ? 1 : 3)
              : "P"}
          </span>
        )}
      </div>
    </div>
  ) : (
    ""
  );
}
