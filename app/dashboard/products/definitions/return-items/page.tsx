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
  const limit = 20;
  const [page, setPage] = useState(1);

  const { data, mutate, isLoading } = useSWR(
    `/api/products/return-items?page=${page}&limit=${limit}`,
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
                <h3 className="mb-1">Returned Items</h3>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li> 
                    <li className="breadcrumb-item active" aria-current="page">Returned Items Summary</li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* <!-- Breadcrumb ends -->

            <!-- Sales stats starts --> */}
            <div className="ms-auto d-lg-flex d-none flex-row">
              <div className="d-flex flex-row gap-1">
                <a href="/dashboard/products/definitions/return-items/submit-return" className="btn btn-outline-primary" type="button"
                  >
                  <i className="bi bi-clock me-1"></i> Return Items
                </a>
                
              </div>
            </div>
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
                  <div className="card-header">
                    <h5 className="card-title">Returned Items</h5>
                  </div>
                  <div className="card-body">

                    {/* <!-- Table start --> */}
                    <div className="table-outer">
                      <div className="table-responsive">
                        <table className="table table-striped table-hover mb-1">
                          <thead>
                            <tr>
                              <th>Return Item ID</th>
                              <th>Product</th>
                              <th>Reason</th>
                              <th>Quantity</th>
                              <th>Returned by</th>
                              <th>Date</th> 
                            </tr>
                          </thead>
                          <tbody>

                         { data.data.data.map((row: any, i: number) => (
                            <tr key={i}>
                              <td>{row.uuid}</td>
                              <td>{row.product_name}</td>
                              <td>{row.reason}</td>
                              <td>{row.quantity}</td>
                              <td>{row.user_name}</td>
                              <td>{row.returned_at.split('T')[0]}</td>
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

function statusBage(status:string) {

    switch (status.toLocaleLowerCase()) {
        case 'pending':
            return 'bg-warning';  
        case 'overdue':
            return 'bg-danger';  
        case 'paid':
            return 'bg-success';  
        default:
            return 'bg-warning'; 
    }

}


