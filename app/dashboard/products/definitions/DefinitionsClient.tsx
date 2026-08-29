"use client";

import useSWR from "swr";
import { useState } from "react";
import Swal from "sweetalert2";
import Loading from "@/app/components/Loading";
import { useSearchParams } from "next/navigation";
import BarcodeModal from "./create/barcodemodal";

type Products = {
  id: string;
  name: string;
  size: string;
  barcode: string;
  cost_price: string;
  selling_price: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DefinitionsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const limit = 10;

  if (searchParams.get("q") && searchParams.get("q") !== search) {
    setSearch(searchParams.get("q") || "");
  }

  const { data, mutate, isLoading } = useSWR(
    `/api/products/definitions?page=${page}&limit=${limit}&q=${encodeURIComponent(search)}`,
    fetcher
  );

  function reloadPage() {
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    window.location.href = url.toString();
  }

  function fnOpenModal(barcode:string, productname:string) {
    setOpenModal(barcode);
    setProductName(productname);
  }
 

  if (isLoading) return <Loading />;
  
  return (
    <div className="container-fluid px-3 pt-2">
      <div className="row">
        <div className="col-md-1 mb-3"></div>

        <div className="col-md-10 mb-3">

          <div className="mb-4"> 
            <form >
            <div className="input-group">
              <input defaultValue={search} name="q" className="form-control" placeholder="Search product names..." />
              {search &&
              <button className="btn btn-primary" onClick={()=>reloadPage()} type="button">Clear Search</button>
              }
              {!search &&
              <button className="btn btn-primary" type="submit">Search</button>
              
              }
            </div>
            </form>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-outer">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Cost Price</th>
                      <th>Selling Price</th>
                      <th>Barcode</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: 11 }}>
                    {data.data.data.map((row: Products, i: number) => (
                      <tr key={row.id} style={{ cursor: "pointer" }}>
                        <td>{i + 1}</td>
                        <td>{row.name} <a href={`/dashboard/products/definitions/create?productid=${row.id}`}><img style={{height:"16px"}} src="/system/external-link.png" /></a> </td>
                        <td>{row.size}</td>
                        <td>{row.cost_price}</td>
                        <td>{row.selling_price}</td>
                        <td>
                          <button 
                          onClick={()=>fnOpenModal(row.barcode || "", row.name || "")}
                          className="btn btn-sm btn-outline-success">Print Barcode</button>
                        </td>

                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={async (e) => {
                              e.stopPropagation();

                              const result = await Swal.fire({
                                title: "Delete product definitions?",
                                text: `Delete "${row.name}"? This cannot be undone.`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#6c757d",
                                confirmButtonText: "Yes, delete",
                              });

                              if (!result.isConfirmed) return;

                               await fetch(
                                    `/api/products/definitions/delete/${row.id}`,
                                    {
                                      method: "DELETE",
                                    }
                                  );
                                Swal.fire({
                                icon: "success",
                                title: "Deleted",
                                timer: 1200,
                                showConfirmButton: false,
                              });
                              mutate();
 
                             
                            }}
                          >
                            Delete
                          </button>
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

       {openModal && (
                    <BarcodeModal
                    barcode={openModal}
                    productname={productName || ""}
                    onClose={() => setOpenModal(null)}
                    onSave={()=>{}} 
                    />
                )}
    </div>
  );
}
