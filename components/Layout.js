import React from "react";
import { Menu } from "@headlessui/react";
import nookies from "nookies";
import Link from "next/link";
import Logo from "./Logo.js";
import Loader from "./Loader";
import { HiOutlineLogout } from "react-icons/hi";
import Router from "next/router";
import Avatar from "./Avatar.js";
import pjson from "../package.json";

const Layout = ({ children, profile, accounts }) => {
  return (
    <div className="relative pt-16 overflow-x-hidden bg-neutral-1">
      {/* Header  */}

      <Header accounts={accounts} profile={profile} />
      <div className="min-h-[80vh] container mx-auto px-4 py-8">{children}</div>

      <div className="bg-brand-600">
        <div className="container p-4 py-16 mx-auto text-sm text-brand-200">
          <Link href="/roadmap">
            <a>
              © {new Date().getFullYear()}{" "}
              <span className="tracking-wider">ᴄαɴɪᴠeᴛe</span>
            </a>
          </Link>
          <span className="ml-4">{pjson.version}</span>
        </div>
      </div>
    </div>
  );
};

export default Layout;

const Header = ({ accounts, profile }) => {
  const account = profile && accounts ? profile.accounts[0] : null;
  return (
    <div className="fixed w-full bg-white bg-opacity-60 z-[9999] filter backdrop-blur-lg top-0 shadow">
      <div className="">
        <div className="container mx-auto">
          <header className="flex items-center justify-between h-16 px-4 ">
            <div
              className={`flex items-center ${
                account ? " divide-x " : ""
              } divide-neutral-2`}
            >
              <div className="pr-4">
                <Link href="/">
                  <a>
                    <Logo />
                  </a>
                </Link>
              </div>
              {account && (
                <Menu as="div" className="relative pl-4">
                  <>
                    <Menu.Button className="flex items-center text-neutral-5 focus:outline-none">
                      <span>{account.name}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 ml-2 text-neutral-4"
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
                    <Menu.Items className="absolute z-10 w-48 mt-2 overflow-hidden bg-white border-t-8 rounded-lg shadow-lg bg-opacity-60 filter backdrop-blur-lg focus:outline-none border-brand-600 ">
                      {accounts.map((account) => (
                        <Link href={account.slug} key={account.slug}>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                className={`${
                                  active ? " bg-brand-600 text-white " : " "
                                }focus:bg-brand-600 focus:text-white hover:bg-brand-600 hover:text-white px-4 py-3 block text-sm cursor-pointer `}
                              >
                                {account.name}
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
            {profile ? (
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 font-medium">
                    <div className="overflow-hidden rounded-full">
                      <Avatar avatar={profile} medium />
                    </div>
                    <div className="text-neutral-5 ">{profile.name}</div>
                    <button
                      className="button button-small button-ghost"
                      onClick={() => {
                        nookies.set(null, "token", null, {
                          maxAge: 0,
                        });

                        Router.push("/login");
                      }}
                    >
                      <HiOutlineLogout className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Loader small />
            )}
          </header>
        </div>
      </div>
    </div>
  );
};
