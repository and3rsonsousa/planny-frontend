import dayjs from "dayjs";
import { HiCheck, HiCheckCircle, HiX, HiXCircle } from "react-icons/hi";
import Avatar from "./Avatar";

export default function Action({ action, setShowDialog }) {
  return (
    <div
      className={`group p-2 pl-5 mt-2 relative rounded-lg text-xs ${action.step.slug}-bg hover-${action.step.slug}-bg cursor-pointer`}
      onClick={() => setShowDialog(true)}
    >
      {/* Nome da Ação */}
      <div className="text-white text-smfont-medium line-clamp-1">
        {action.name}
      </div>
      {/* Avatar da Conta */}
      <div className="absolute -ml-6 top-2">
        <Avatar smallest border avatar={action.account} />
      </div>
      {/* Tags */}
      {action.step.slug != "accomplished" && (
        <>
          <div className="flex mt-1 leading-tight tracking-wide uppercase text-xx ">
            <div className="flex flex-wrap">
              {action.tags.map((tag, i) => (
                <div key={tag.id} className="mr-1">
                  {tag.name}
                  {i < action.tags.length ? "," : null}
                </div>
              ))}
            </div>
          </div>
          <div className="tracking-widest text-right text-white text-xx">
            {dayjs(action.date).format("H[h]m")}
          </div>
        </>
      )}
      {/* Deletar a Ação */}
      <button className="absolute top-0 right-0 invisible p-1 text-white transition-all opacity-0 duration-500rounded-lg group-hover:visible group-hover:opacity-100">
        <HiX className="text-lg transition-opacity duration-200 cursor-pointer opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
