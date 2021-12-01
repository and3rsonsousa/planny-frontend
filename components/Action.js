import dayjs from "dayjs";
import Color from "color";
import { BiDuplicate } from "react-icons/bi";
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
  setActionToDuplicate,
}) {
  return (
    <div
      className={`p-2 mt-2 relative transition rounded-lg text-xs ${
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
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-wrap text-xs">
              {action.tags.map((tag, i) => (
                <div key={tag.id} className="mr-1">
                  {tagsIcons(tag.slug)}
                </div>
              ))}
            </div>
            <div className="leading-none tracking-widest text-right text-white text-xx">
              {dayjs(action.date).format("H[h]m")}
            </div>
          </div>
        )}
      </div>
      {/* Ações extras */}
      <div className="absolute top-0 right-0 h-full text-white group">
        <div
          className={`flex items-center invisible h-full pr-2 pl-8 opacity-0 ${action.step.slug}-transparent-bg rounded-r-lg group-hover:visible group-hover:opacity-100 transition-opacity duration-300`}
          style={
            color == 2
              ? {
                  backgroundImage: `linear-gradient(to left, ${
                    action.account.colors[0].hex
                  }, ${action.account.colors[0].hex}, ${Color(
                    action.account.colors[0].hex
                  ).alpha(0)})`,
                  color: action.account.colors[1].hex,
                }
              : {}
          }
        >
          <button>
            <BiDuplicate
              className="text-lg transition-opacity duration-200 cursor-pointer opacity-70 hover:opacity-100"
              onClick={(event) => {
                if (!action.clientOnly) {
                  setActionToDuplicate(action.id);
                  setShowDialog(true);
                }
              }}
            />
          </button>

          <button
            onClick={(event) => {
              deleteAction(action, mutate);
              // setShowDialog(false);
            }}
          >
            <HiX className="text-lg transition-opacity duration-200 cursor-pointer opacity-70 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
