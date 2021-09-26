import { useRouter } from "next/router";
import nookies from "nookies";

const Authentication = ({ children }) => {
  const router = useRouter();
  const logged = nookies.get(null).jwt;
  if (!logged) {
    console.log("NAO LOGADO");
    try {
      if (window) {
        router.push("/login");
      }
    } catch {}
  }
  return children;
};

export default Authentication;
