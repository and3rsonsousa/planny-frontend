import React from "react";
import { Menu } from "@headlessui/react";
import nookies from "nookies";
import Link from "next/link";
import Logo from "./Logo.js";
import Loader from "./Loader";
import { HiLogout, HiOutlineLogout } from "react-icons/hi";
import Router from "next/router";

const Layout = ({ children, user }) => {
  let { client, clients } = user || {};

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
                          <Link href={client.slug} key={client.slug}>
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
                    <h4 className="font-medium flex items-center mb-0">
                      <div className="text-gray-600">{user.name}</div>
                      <button
                        className="button button-small button-ghost ml-1"
                        onClick={() => {
                          nookies.set(null, "token", null, {
                            maxAge: 0,
                          });
                          nookies.set(null, "user", null, {
                            maxAge: 0,
                          });
                          Router.reload();
                        }}
                      >
                        <HiOutlineLogout className="text-lg" />
                      </button>
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
