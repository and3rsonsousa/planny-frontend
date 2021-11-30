import dayjs from "dayjs";
import { HiCheck, HiCheckCircle, HiX, HiXCircle } from "react-icons/hi";
import { deleteAction } from "../lib/mutations";
import tagsIcons from "../lib/tagsIcon";
import Avatar from "./Avatar";

export default function Action({
  action,
  mutate,
  color,
  setShowDialog,
  setActionToUpdate,
}) {
  return (
    <div
      className={`group p-2 mt-2 relative rounded-lg text-xs ${
        action.step.slug
      }-bg hover-${action.step.slug}-bg ${
        action.clientOnly
          ? " cursor-wait opacity-25  transform scale-90"
          : " cursor-pointer "
      }`}
      style={
        color == 2
          ? {
              backgroundColor: action.account.colors[0].hex,
              color: action.account.colors[1].hex,
            }
          : {}
      }
    >
      <div
        onClick={() => {
          if (!action.clientOnly) {
            setActionToUpdate(action.id);
            setShowDialog(true);
          }
        }}
      >
        {/* Nome da Ação */}
        <div
          className={`text-smfont-medium line-clamp-1 ${
            color === 1 ? "pl-2" : ""
          }`}
        >
          {action.name}
        </div>
        {/* Avatar da Conta */}
        {color === 1 && (
          <div className="absolute -ml-4 top-2">
            <Avatar smallest border avatar={action.account} />
          </div>
        )}
        {/* Tags */}
        {action.step.slug != "accomplished" && (
          <div className="flex justify-between items-center mt-1">
            <div className="flex flex-wrap text-xs">
              {action.tags.map((tag, i) => (
                <div key={tag.id} className="mr-1">
                  {tagsIcons(tag.slug)}
                </div>
              ))}
            </div>
            <div className="tracking-widest leading-none text-right text-white text-xx">
              {dayjs(action.date).format("H[h]m")}
            </div>
          </div>
        )}
      </div>
      {/* Deletar a Ação */}
      <button
        className="absolute top-0 right-0 invisible p-1 text-white transition-all opacity-0 duration-500rounded-lg group-hover:visible group-hover:opacity-100"
        onClick={(event) => {
          deleteAction(action, mutate);
          setShowDialog(false);
        }}
      >
        <HiX className="text-lg transition-opacity duration-200 cursor-pointer opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
