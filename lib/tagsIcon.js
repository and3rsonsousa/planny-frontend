import {
  HiOutlineBriefcase,
  HiOutlineDocumentDuplicate,
  HiOutlineHeart,
} from "react-icons/hi";
import { MdOutlineRefresh, MdOutlineSlowMotionVideo } from "react-icons/md";
import { IoPlayOutline, IoText, IoVideocamOutline } from "react-icons/io5";

export default function tagsIcons(slug) {
  switch (slug) {
    case "post":
      return <HiOutlineHeart className="w-5 h-5 mr-2" />;
    case "stories":
      return <MdOutlineRefresh className="w-5 h-5 mr-2" />;
    case "reels":
      return <MdOutlineSlowMotionVideo className="w-5 h-5 mr-2" />;
    case "meeting":
      return <HiOutlineBriefcase className="w-5 h-5 mr-2" />;
    case "copy":
      return <IoText className="w-5 h-5 mr-2" />;
    case "video":
      return <IoPlayOutline className="w-5 h-5 mr-2" />;
    case "shooting":
      return <IoVideocamOutline className="w-5 h-5 mr-2" />;
    case "press":
      return <HiOutlineDocumentDuplicate className="w-5 h-5 mr-2" />;
  }
}
