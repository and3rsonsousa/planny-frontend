import { useRouter } from "next/router";
import nookies from "nookies";
import { useEffect } from "react/cjs/react.development";
import useUser from "../lib/useUser";
import Loader from "./Loader";

const Authentication = ({ children }) => {
  const router = useRouter();
  const { user, loading, error } = useUser();

  useEffect(() => {
    if (loading) return <Loader />;
    if (user) {
      console.log(user);
    } else {
      router.push("/login");
      return false;
    }
  }, [user, loading]);

  return children;
};

export default Authentication;
