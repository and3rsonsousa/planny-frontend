export default function ClientAvatar({
  client,
  small = false,
  medium = false,
  border,
}) {
  return client ? (
    <div>
      <div
        className={` ${
          small
            ? "w-5 h-5 text-xs"
            : medium
            ? "w-10 h-10 text-sm"
            : "w-14 h-14 text-base"
        } rounded-full font-extrabold bg-gray-300 flex justify-center items-center${
          border ? " ring-2 ring-white" : ""
        }`}
        style={{ backgroundColor: client.bgColor }}
      >
        <span style={{ color: client.fgColor }}>
          {client.name ? client.name.substr(0, 1) : "P"}
        </span>
      </div>
    </div>
  ) : (
    ""
  );
}
