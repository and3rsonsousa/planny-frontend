import ClientAvatar from "./ClientAvatar";
import Link from "next/link";

export default function ClientsBar({ small, medium, clients }) {
  return (
    <div className={`w-full overflow-x-auto`}>
      <div className="flex px-2 w-full justify-center">
        {clients.map((client, j) => (
          <div
            key={j}
            className={`transform 
            transition-all 
            duration-500  
            ${small ? " w-8 p-1" : medium ? " w-12 p-2 " : "w-24 p-4 mr-2"}
            cursor-pointer hover:text-gray-800
            `}
          >
            <Link href={`/${client.instagram}`} key={client.instagram}>
              <div className="flex flex-col items-center">
                <ClientAvatar client={client} small={small} medium={medium} />
                {!(small || medium) ? (
                  <a className="block w-full mt-2 text-sm truncate text-center">
                    {client.instagram}
                  </a>
                ) : null}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
