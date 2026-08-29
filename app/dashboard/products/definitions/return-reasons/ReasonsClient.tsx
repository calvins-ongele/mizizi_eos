"use client";

import useSWR from "swr";
import { useState } from "react";
import ReasonsAdd from "./ReasonsAdd";
import Swal from "sweetalert2";
import Loading from "@/app/components/Loading";

type Category = {
  id: string;
  name: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ReasonsClient() {
  const { data, mutate, isLoading } = useSWR(
    "/api/products/return-reasons",
    fetcher
  );

  const [editing, setEditing] = useState<Category | null>(null);

  if (isLoading) {
    return Loading({height:200}); 

  }

  return (
    <div className="container-fluid px-3 pt-2">
      <div className="row">
        <div className="col-md-6 mb-3">
          <ReasonsAdd
            editing={editing}
            clearEditing={() => setEditing(null)}
            onSaved={() => mutate()} // refetch after add/update
          />
        </div>

        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((cat: Category, i: number) => (
                    <tr
                      key={cat.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditing(cat)} //  click to edit
                    >
                      <td>{i + 1}</td>
                      <td>{cat.name}</td>
                      <td className="text-end">  
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={async (e) => {
                            e.stopPropagation();

                            const result = await Swal.fire({
                              title: "Delete item?",
                              text: `Delete "${cat.name}"? This cannot be undone.`,
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#6c757d",
                              confirmButtonText: "Yes, delete",
                            });

                            if (!result.isConfirmed) return;

                            await mutate(
                              async (current: { data: any[]; }) => {
                                await fetch(
                                  `/api/products/return-reasons/delete/${cat.id}`,
                                  {
                                    method: "DELETE",
                                  }
                                );

                                return {
                                  ...current,
                                  data: current.data.filter(
                                    (c: any) => c.id !== cat.id
                                  ),
                                };
                              },
                              { revalidate: false }
                            );

                            Swal.fire({
                              icon: "success",
                              title: "Deleted",
                              timer: 1200,
                              showConfirmButton: false,
                            });
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
