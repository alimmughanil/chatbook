import { Link, router, useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { currency, dateTime, sortBy } from "@/utils/format";
import Pagination from "@/Components/Pagination";
import WithModal from "@/Components/WithModal";

function Index(props) {
  const location = new URL(props.location);
  const params = new URLSearchParams(location.search);
  const tableHeaders = useTableHeader();
  const [open, setOpen] = useState(false);

  return (
    <AuthenticatedLayout
      title={props.title}
      open={open}
      setOpen={setOpen}
      auth={props.auth}
    >
      <div className="flex flex-col items-center justify-center gap-4 mt-4">
        <div className="relative w-screen overflow-x-auto sm:w-full">
          <table className="table w-full table-compact">
            <thead className="">
              <tr>
                {tableHeaders.map((header) => (
                  <th scope="col" className="text-start">
                    <button
                      onClick={() => sortBy(header.value, router, params)}
                      className={`${params.get('sort') != header.value ? "" : "bg-primary text-gray-100 px-2 rounded-lg font-normal"}`}
                    >
                      {header.label}
                    </button>
                  </th>
                ))}
                <th scope="col" className="text-start normal-case">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {props.contacts.data.length == 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center ">
                    <p>Belum ada data yang dapat ditampilkan</p>
                  </td>
                </tr>
              ) : (
                props.contacts.data.map((contact, i) => {
                  return (
                    <tr key={i} className="text-start">
                      <td>{i + 1}</td>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>
                        {dateTime(contact.created_at)}
                      </td>
                      <td><Link href={`/contact/${contact.email}`} className="btn btn-primary btn-xs text-white">Balas</Link></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-end w-full pt-2 pb-4">
            {!props.contacts.links ? null : (
              <ul className="flex list-style-none">
                <Pagination links={props.contacts.links} />
              </ul>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

const useTableHeader = () => {
  const header = [
    {
      label: "#",
      value: "id",
    },
    {
      label: "Nama",
      value: "name",
    },
    {
      label: "Email",
      value: "email",
    },
    {
      label: "Waktu",
      value: "created_at",
    },
  ];

  return header;
};


export default Index;
