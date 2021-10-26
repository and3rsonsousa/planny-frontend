import AccountAvatar from "./Avatar";
import Link from "next/link";
import Avatar from "./Avatar";

export default function AccountsBar({ small, medium, accounts }) {
  return (
    <div className="flex overflow-hidden divide-x shadow rounded-2xl">
      {accounts.map((account) => (
        <div
          className="flex items-center justify-center flex-auto p-4 space-x-2 text-xs font-medium tracking-wider uppercase truncate transition-colors duration-300 bg-white cursor-pointer hover:bg-brand-600 hover:text-white"
          key={account.id}
        >
          <Avatar small={true} avatar={account} />
          <div className="truncate">
            <Link href={`/${account.slug}`}>
              <a>
                <span>{account.name}</span>
              </a>
            </Link>
          </div>
        </div>
      ))}
    </div>
    // <div className={`w-full overflow-x-auto`}>
    //   <div className="flex justify-center w-full py-2">
    //     {accounts.map((account, j) => (
    //       <div
    //         key={j}
    //         className={`transform
    //         transition-transform
    //         duration-500
    //         hover:-translate-y-2
    //         ${small ? " w-8 p-1" : medium ? " w-12 p-2 " : "p-2"}
    //         cursor-pointer
    //         `}
    //       >
    //         <Link href={`/${account.slug}`} key={account.slug}>
    //           <div className="flex flex-col items-center">
    //             <AccountAvatar avatar={account} small={small} medium={medium} />
    //           </div>
    //         </Link>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}
