import { HiCheck, HiCheckCircle, HiX, HiXCircle } from "react-icons/hi";
import ClientAvatar from "./ClientAvatar";

export default function Action({ action, setShowDialog }) {
  return (
    <div
      className={`group p-2 pl-5 mt-2 relative rounded-lg text-xs ${action.status.slug}-bg cursor-pointer`}
      onClick={() => setShowDialog(true)}
    >
      <div className="text-smfont-medium text-white line-clamp-1">
        {action.name}
      </div>

      <div className="absolute -ml-7 top-2">
        <ClientAvatar small={true} client={action.client} border={true} />
      </div>
      <div className="mt-1 flex text-xx uppercase tracking-wide leading-tight ">
        <div className="flex flex-wrap">
          {action.tags.map((tag, i) => (
            <div key={tag.id} className="mr-1">
              {tag.name}
              {i < action.tags.length ? "," : null}
            </div>
          ))}
        </div>
      </div>
      <div className="invisible opacity-0 rounded-lg absolute inset-0 bg-gradient-to-bl from-[#ffffff66] via-transparent p-1  text-white flex justify-end  transition-all duration-500 group-hover:visible group-hover:opacity-100">
        <HiCheck className="text-lg opacity-70 transition-opacity duration-200 hover:opacity-100 cursor-pointer" />
        <HiX className="text-lg opacity-70 transition-opacity duration-200 hover:opacity-100 cursor-pointer" />
      </div>
    </div>
  );
}
