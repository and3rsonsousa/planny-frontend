import { useEffect } from "react";
import { Menu } from "@headlessui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "./Logo.js";
import Loader from "./Loader";
import useGQL from "../lib/useGQL.js";
import useUser from "../lib/useUser.js";

const Layout = ({ QUERY, children }) => {
  const user = null;
  const { data, loading, error } = useGQL(QUERY);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (!user) {
    return (
      <div className="flex justify-center items-center p-8 h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  const router = useRouter();
  let { client, clients } = user || {};

  // if (QUERY) {
  //   const { data, error, loading } = useGQL(QUERY);

  //   if (error) return error;

  //   useEffect(() => {
  //     console.log(data);
  //   }, [data]);
  // }

  return (
    <div className="bg-gray-100 overflow-x-hidden">
      <div className="w-full border-t-4 border-brand-600 bg-white">
        <div className="shadow-sm">
          <div className="container mx-auto">
            <header className="p-4 flex justify-between items-center">
              <div
                className={`flex items-center ${
                  client ? " divide-x " : ""
                } divide-gray-200`}
              >
                <div className="pr-4">
                  <Link href="/">
                    <a>
                      <Logo />
                    </a>
                  </Link>
                </div>
                {client && (
                  <Menu as="div" className="relative pl-4">
                    <>
                      <Menu.Button className="focus:outline-none text-gray-700 flex items-center">
                        <span>{client[0].name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Menu.Button>
                      <Menu.Items className="bg-white absolute shadow-lg border mt-2 rounded-lg w-48 focus:outline-none z-10 ">
                        {clients.map((client) => (
                          <Link href={client.instagram} key={client.instagram}>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  className={`${
                                    active
                                      ? " bg-brand-100 text-brand-600 "
                                      : " "
                                  }focus:bg-brand-100 focus:text-brand-600 hover:bg-brand-100 hover:text-brand-600 px-4 py-3 text-gray-700 font-medium block text-sm cursor-pointer `}
                                >
                                  {client.name}
                                </a>
                              )}
                            </Menu.Item>
                          </Link>
                        ))}
                      </Menu.Items>
                    </>
                  </Menu>
                )}
              </div>
              {user ? (
                <div className="flex gap-4">
                  <div className="text-right">
                    <h4 className="font-medium text-gray-600 flex items-center">
                      <div>{user.name}</div>
                      <a
                        href="#"
                        className="text-gray-400 ml-2"
                        onClick={() => {
                          nookies.set(null, "jwt", null, {
                            maxAge: 0,
                          });
                          nookies.set(null, "user", null, {
                            maxAge: 0,
                          });
                          router.reload();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </a>
                    </h4>
                  </div>
                </div>
              ) : (
                <Loader small />
              )}
            </header>
          </div>
        </div>
      </div>

      <div className="min-h-[80vh] container mx-auto px-4 py-8">{children}</div>

      <div className="bg-brand-600">
        <div className="container mx-auto p-4 py-16 text-brand-200 text-sm">
          <Link href="/roadmap">
            <a>
              © {new Date().getFullYear()}{" "}
              <span className="tracking-wider">ᴄαɴɪᴠeᴛe</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Layout;
