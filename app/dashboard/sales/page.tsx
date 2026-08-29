"use client"; 
import { useEffect, useRef, useState } from "react";
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
import ReceiptModal from "../dashboardmodals/receipt.dashboard.modal";


const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function SalesPage() {

  const [loading, setLoading] = useState(false); 
  const limit = 10;
  const [page, setPage] = useState(1);
  const [openReceiptModal, setOpenReceiptModal] = useState<string | null>(null);

  const { data, mutate, isLoading } = useSWR(
    `/api/pos/sales?page=${page}&limit=${limit}`,
    fetcher
  );
 
  function statusBadge(status:string):string {
    switch (status) {
      case 'pending':
          return "text-warning";
      case 'paid':
          return "text-success";
      case 'cancelled':
          return "text-danger"; 
      default:
          return "text-danger"; 
    }
  }

  
    async function printLastSlip(uid:string) {
      setLoading(true); 
      try {
        
      const response = await fetch("/api/pos/last-slip",{method:"POST", body:JSON.stringify({uid})});
      const type = response.headers.get("X-Response-Type")||""; 
      if (type === 'pdf') { 
        const blob = await response.blob(); 
        const url = URL.createObjectURL(blob);
        setOpenReceiptModal(url); 
        return;
      }
      const result = await response.json();
  
      Swal.fire({ 
          text: `${result.message || "An error occurred"}`,
          icon: "error", 
        });
  
      } catch(e) {}
      finally {
        setLoading(false);
      }
    }
  

  if (isLoading) return Loading({});

    return (
        <div className="container-fluid px-3 pt-3">
            <div className="app-body">

            {/* <!-- Row start --> */}
            <div className="row gx-4">
              <div className="col-xxl-3 col-sm-6 col-12">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>Total Sales</h6>
                    <span className="monthDisplay mb-3 badge bg-primary-subtle text-primary">In June</span>
                    <div className="d-flex align-items-center">
                      <div className="icon-box md rounded-5 bg-primary">
                        <i className="bi bi-file-earmark-text fs-5"></i>
                      </div>
                      <small className="ms-2 badge bg-primary-subtle text-primary">80% high.</small>
                      <h2 className="ms-auto">65</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-sm-6 col-12">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>Paid Sales</h6>
                    <span className="monthDisplay mb-3 badge bg-primary-subtle text-primary">In June</span>
                    <div className="d-flex align-items-center">
                      <div className="icon-box md rounded-5 bg-primary">
                        <i className="bi bi-cash-stack fs-5"></i>
                      </div>
                      <small className="ms-2 badge bg-primary-subtle text-primary">60% high.</small>
                      <h2 className="ms-auto">89</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-sm-6 col-12">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>Pending Sales</h6>
                    <span className="monthDisplay mb-3 badge bg-primary-subtle text-primary">In June</span>
                    <div className="d-flex align-items-center">
                      <div className="icon-box md rounded-5 bg-primary">
                        <i className="bi bi-hourglass-split fs-5"></i>
                      </div>
                      <small className="ms-2 badge bg-primary-subtle text-primary">30% low.</small>
                      <h2 className="ms-auto">47</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-sm-6 col-12">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>Overdue Sales</h6>
                    <span className="monthDisplay mb-3 badge bg-primary-subtle text-primary">In June</span>
                    <div className="d-flex align-items-center">
                      <div className="icon-box md rounded-5 bg-primary">
                        <i className="bi bi-exclamation-circle fs-5"></i>
                      </div>
                      <small className="ms-2 badge bg-primary-subtle text-primary">20% low.</small>
                      <h2 className="ms-auto">33</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Row end --> */}

            {/* <!-- Row start --> */}
            <div className="row">
              <div className="col-12">
                {/* <!-- Card starts --> */}
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Sales List</h5>
                    <div>
                      <a href="/dashboard" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-1"></i>Create a Sale
                      </a>
                    </div>
                  </div>
                  <div className="card-body">

                    {/* <!-- Row start --> */}
                    <div className="row justify-content-between mb-4">
                      <div className="col-sm-4">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-search text-muted"></i>
                          </span>
                          <input type="text" className="form-control" id="searchInvoice" placeholder="Search Sales..." />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <select className="form-select" id="statusFilter" aria-label="Filter by payment status">
                            <option  >Status</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Overdue</option>
                            <option>Cancelled</option>
                          </select>
                          <select className="form-select" id="dateFilter" aria-label="Filter by date range">
                            <option  >Date</option>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>Custom date</option>
                          </select>
                          <button type="button" className="btn btn-primary">
                            Filter
                          </button>
                          <div className="dropdown">
                            <button className="btn btn-soft-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="bi bi-three-dots"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" >
                              <li><a className="dropdown-item" href="#">Export to Excel</a></li>
                              <li><a className="dropdown-item" href="#">Export to PDF</a></li>
                              <li><a className="dropdown-item" href="#">Download Sales</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <!-- Row end --> */}

                    {/* <!-- Row start --> */}
                    <div className="row gx-4">
                      <div className="col-sm-12">
                        {/* <!-- Table responsive wrapper --> */}
                        <div className="invoice-table-container">
                          <div className="table-outer">
                            <div className="table-responsive">
                              <table className="table table-hover align-middle mb-1">
                                <thead className="table-light">
                                  <tr>
                                    
                                    <th scope="col">Sale #</th>
                                    <th scope="col">Client</th>
                                    <th scope="col">Sale Date</th> 
                                    <th scope="col">Amount</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>

                                  { data.data.data.map((row: any, i: number) => (
                                                               
                                  <tr key={row.uuid || row.id}>
                                    
                                    <td><a href="#invoice" className="text-primary fw-semibold">#{row.receipt_no}</a></td>
                                    <td>
                                      <div className="d-flex align-items-center"> 
                                        <span>{row.customer_name}</span>
                                      </div>
                                    </td>
                                    <td>{row.created_at.split('T')[0]}</td> 
                                    <td className="fw-semibold">KES {row.total}</td>
                                    <td><span className={`${statusBadge(row.status) ?? ""} text-capitalize`}>{row.status}</span></td>
                                    <td>
                                      <div className="d-flex gap-1">
                                        
                                        <a 
                                        onClick={()=>printLastSlip(row.uuid)}
                                        className="btn btn-sm btn-outline-primary"  data-bs-toggle="tooltip" aria-label="View profile" data-bs-original-title="Print Recipt">
                                          <i className="bi bi-printer"></i>
                                        </a>
                                          {
                                            row.status=="pending" && (
                                              <a href={`/dashboard?uid=`+ row.uuid } className="btn btn-sm btn-outline-danger" data-bs-toggle="tooltip" aria-label="View profile" data-bs-original-title="Continue to Checkout">
                                                Continue
                                              </a>
                                            )
                                          }
                                      </div>
                                    </td>
                                  </tr>
                                  ))}

                                   
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* <!-- Pagination --> */} 
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
                    {/* <!-- Row end --> */}

                  </div>
                </div>
                {/* <!-- Card ends --> */}

              </div>
            </div>
            {/* <!-- Row end --> */}

    

          </div>

          
                  {openReceiptModal && (
                      <ReceiptModal
                      enquiry={openReceiptModal}
                      onClose={() => setOpenReceiptModal(null)} 
                      />
                  )}
          
            <JqueryMin />
            <BootstrapBundle />
            <MomentMin />
            <OverlayScrollbarsInit /> 
            <CustomMin />
        </div>
    );
}


