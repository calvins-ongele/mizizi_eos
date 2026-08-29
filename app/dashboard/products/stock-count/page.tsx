"use client"; 
import { useState } from "react";
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients";
import Loading from "@/app/components/Loading";
import useSWR from "swr"; 
import Swal from "sweetalert2"; 
import { capitalizeFirstLetter } from "@/engine/utils/helpers";


const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function ReturnItemsPage() { 

  const [loading, setLoading] = useState(false); 
  const limit = 50;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const { data, mutate, isLoading } = useSWR(
    `/api/products/stock?page=${page}&limit=${limit}&order=${order}`,
    fetcher
  );

  if (isLoading) return;

    return (
        <div className="container-fluid px-3 pt-3"> 
            <div className="app-container"> 
          {/* <!-- App hero header starts --> */}
          <div className="app-hero-header d-flex align-items-center"> 
            {/* <!-- Breadcrumb starts --> */}
            <div className="d-flex align-items-center">
              <div className="me-3 icon-box md border bg-white rounded-5">
                <i className="bi bi-arrow-up-right-circle fs-5 text-primary"></i>
              </div>
              <div>
                <h3 className="mb-1">Stock Count</h3>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li> 
                    <li className="breadcrumb-item active" aria-current="page">Stock Count Summary</li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* <!-- Breadcrumb ends -->

             
            {/* <!-- Sales stats ends --> */}

          </div>
          {/* <!-- App Hero header ends -->

          <!-- App body starts --> */}
          <div className="app-body">

            {/* <!-- Row start --> */}
            <div className="row gx-4">
              
          
             

            </div>
            {/* <!-- Row end -->

            <!-- Row start --> */}
            <div className="row gx-4">
              <div className="col-sm-12">
                {/* <!-- Card start --> */}
                <div className="card">
                 
                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title">Stock {order==='asc' ? 'Ascending' : 'Descending'}</h5>                       

                       <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <select className="form-select" id="statusFilter" aria-label="Filter by payment status" value={order}
                           onChange={(e) => setOrder(e.target.value as "asc" | "desc")}>
                             
                            <option value="asc">Sort Ascending</option>
                            <option value="desc">Sort Descending</option>
                          </select>
                          </div>
                          </div>
                    </div>

                    {/* <!-- Table start --> */}
                    <div className="table-outer">
                      <div className="table-responsive">
                        <table className="table table-striped table-hover mb-1">
                          <thead>
                            <tr> 
                              <th>Product</th>
                              <th>Barcode</th>
                              <th>Category</th>
                              <th>Quantity</th> 
                            </tr>
                          </thead>
                          <tbody>

                         { data.data.data.map((row: any, i: number) => (
                            <tr key={i}> 
                              <td>{row.product_name}</td>
                              <td>{row.barcode}</td> 
                              <td>{row.category_name}</td>
                              <td>{row.stock_count}</td>
                            </tr> 

                            ))}
                             
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* <!-- Table end --> */}

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
                {/* <!-- Card end --> */}

              </div>
            </div>
            {/* <!-- Row end --> */}


       

          </div>
     

        </div>
                     
          
            <JqueryMin />
            <BootstrapBundle />
            <MomentMin />
            <OverlayScrollbarsInit /> 
            <CustomMin />
        </div>
    );
} 
