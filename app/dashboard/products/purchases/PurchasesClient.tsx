"use client";

import useSWR from "swr";
import { useState } from "react";
import Swal from "sweetalert2";
import Loading from "@/app/components/Loading";

type Products = {
  id: string;
  supplier_name: string;
  total_cost: string;
  quantity: string;
  created_at: string;
  purchase_id: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PurchasesClient() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, mutate, isLoading } = useSWR(
    `/api/products/purchases?page=${page}&limit=${limit}`,
    fetcher
  );
 

  if (isLoading) return <Loading />;
  
  return (
    <div className="container-fluid px-3 pt-2">
      <div className="row">
        <div className="col-md-1 mb-3"></div>

        <div className="col-md-10 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="table-outer">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Supplier</th>
                      <th>Total Cost</th>
                      <th>Quantity</th>
                      <th>Created at</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: 11 }}>
                    {data.data.data.map((row: Products, i: number) => (
                      <tr key={row.id} style={{ cursor: "pointer" }}>
                        <td>{i + 1}</td>
                        <td>{row.supplier_name} </td>
                        <td>{row.total_cost}</td>
                        <td>{row.quantity}</td>
                        <td>{row.created_at.split("T")[0]}</td>

                        <td className="text-end">
                          <a href={`/dashboard/products/purchases/${row.purchase_id}`}
                            className="btn btn-sm btn-outline-success" 
                          >
                            Print Note
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {data && (
                  <div className="d-flex justify-content-between align-items-center mt-2 p-2">
                    <small>
                      Page {data.data.page} of {data.data.totalPages} — Total {data.data.total}{" "}
                      items
                    </small>

                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        Prev
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        disabled={page === data.data.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
