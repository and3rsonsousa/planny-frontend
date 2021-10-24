import {
  HiOutlineBriefcase,
  HiOutlineDocumentDuplicate,
  HiOutlineHeart,
} from "react-icons/hi";
import { MdOutlineRefresh, MdOutlineSlowMotionVideo } from "react-icons/md";
import { IoPlayOutline, IoText, IoVideocamOutline } from "react-icons/io5";

export default function tagsIcons(slug, className) {
  switch (slug) {
    case "post":
      return <HiOutlineHeart className={className} />;
    case "stories":
      return <MdOutlineRefresh className={className} />;
    case "reels":
      return <MdOutlineSlowMotionVideo className={className} />;
    case "meeting":
      return <HiOutlineBriefcase className={className} />;
    case "copy":
      return <IoText className={className} />;
    case "video":
      return <IoPlayOutline className={className} />;
    case "shooting":
      return <IoVideocamOutline className={className} />;
    case "press":
      return <HiOutlineDocumentDuplicate className={className} />;
  }
}
