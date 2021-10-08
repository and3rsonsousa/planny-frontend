import ClientAvatar from "./ClientAvatar";
import Link from "next/link";

export default function ClientsBar({ small, medium, clients }) {
  return (
    <div className={`w-full overflow-x-auto`}>
      <div className="flex py-2 w-full justify-center">
        {clients.map((client, j) => (
          <div
            key={j}
            className={`transform 
            transition-transform
            duration-500 
            hover:-translate-y-2
            ${small ? " w-8 p-1" : medium ? " w-12 p-2 " : "p-2"}
            cursor-pointer
            `}
          >
            <Link href={`/${client.slug}`} key={client.slug}>
              <div className="flex flex-col items-center">
                <ClientAvatar client={client} small={small} medium={medium} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
