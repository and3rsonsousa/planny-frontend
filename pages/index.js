import Head from "next/head";
import Authentication from "../components/Authentication";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ClientsBar from "../components/ClientsBar";
import Display from "../components/Display";
import { gql } from "graphql-request";

const Home = ({ data, error, isValidating }) => {
  const QUERY_ = gql`
    query ($userId: ID!) {
      user(id: $userId) {
        id
        name
        email
        clients(sort: "name:asc") {
          id
          name
          instagram
          fgColor
          bgColor
          actions(sort: "date:asc") {
            id
            date
            name
            status {
              slug
            }
          }
        }
      }
      statuses {
        id
        name
        slug
        actions {
          id
        }
      }
    }
  `;

  const QUERY = gql`
    {
      actions {
        id
        name
      }
    }
  `;

  return (
    <Authentication>
      <Layout QUERY={QUERY}>
        <Head>
          <title>Carregando dados... | Planny</title>
        </Head>

        {isValidating && !data ? (
          <Loader />
        ) : (
          <div>OK</div>
          // <div>
          //   <Head>
          //     <title>{data.user.name} | Planny</title>
          //   </Head>
          //   {/* Barra superior com os Clients */}
          //   <ClientsBar clients={data.user.clients} />
          //   {/* Insight por Status e por Clientes */}
          //   <div className="lg:grid grid-cols-2 gap-8 mb-8">
          //     <div className="my-4">
          //       <h3 className="text-gray-700">Status</h3>
          //       <div className="status-demo w-full">
          //         {data.statuses.map((stat, index) => {
          //           const count = stat.actions.length;

          //           return count ? (
          //             <div
          //               className={`${stat.slug}-bg py-2 overflow-hidden flex-auto text-center`}
          //               key={index}
          //               style={{
          //                 width: (count / 4) * 100 + "%",
          //               }}
          //             >
          //               <span className="uppercase text-xx font-semibold tracking-widest">
          //                 {stat.name} ({stat.actions.length})
          //               </span>
          //             </div>
          //           ) : null;
          //         })}
          //       </div>
          //     </div>
          //     <div className="my-4">
          //       <h3 className="text-gray-700">Clientes</h3>
          //       <div className="status-demo w-full">
          //         {data.user.clients.map((client, index) => {
          //           const count = client.actions.length;

          //           return count ? (
          //             <div
          //               className={`py-2 overflow-hidden flex-auto text-center`}
          //               key={index}
          //               style={{
          //                 width: (count / 4) * 100 + "%",
          //                 backgroundColor: client.bgColor,
          //                 color: client.fgColor,
          //               }}
          //             >
          //               <span className="uppercase text-xx font-semibold tracking-widest">
          //                 {client.name} ({client.actions.length})
          //               </span>
          //             </div>
          //           ) : null;
          //         })}
          //       </div>
          //     </div>
          //   </div>
          //   {/* Ações */}
          //   <div className="mb-8">
          //     <h3 className="text-gray-700">Ações</h3>
          //     <div className="flex justify-between mb-2">
          //       <div>Filtros de Ações</div>
          //       <div>Filtros de Status</div>
          //       <div>Filtros de Clientes</div>
          //     </div>

          //     <Display clients={data.user.clients} />
          //   </div>
          //   {/* decode */}
          //   <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
          //     <pre>{JSON.stringify(data, null, 2)}</pre>
          //   </div>
          // </div>
        )}
      </Layout>
    </Authentication>
  );
};

export default Home;
