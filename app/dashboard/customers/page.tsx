"use client"; 
import {  useState } from "react";
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients";
import Loading from "@/app/components/Loading";
import useSWR from "swr";
import { toIso } from "../planifi/page";
import Swal from "sweetalert2";


const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function CustomersPage() {

  const [loading, setLoading] = useState(false); 
  const limit = 10;
  const [page, setPage] = useState(1);

  const { data, mutate, isLoading } = useSWR(
    `/api/customers?page=${page}&limit=${limit}`,
    fetcher
  );

  if (isLoading) {
    return Loading({height:200});
  }

    return (
        <div className="container-fluid px-3 pt-3">


            <div className="app-container">

          {/* <!-- App hero header starts --> */}
          <div className="app-hero-header d-flex align-items-center">

            {/* <!-- Breadcrumb starts --> */}
            <div className="d-flex align-items-center">
              <div className="me-3 icon-box md border rounded-3">
                <i className="bi bi-people fs-5 text-primary"></i>
              </div>
              <div>
                <h3 className="mb-1 fw-bold">Customers</h3>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li> 
                    <li className="breadcrumb-item active" aria-current="page">Customers List</li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* <!-- Breadcrumb ends -->

            <!-- Sales stats starts --> */}
            {/* <div className="ms-auto d-lg-flex d-none flex-row">
              <div className="d-flex flex-row gap-2">
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#addNewUser">
                  <i className="bi bi-person-plus me-1"></i> Add New User
                </button>
                <button type="button" className="btn btn-danger">
                  <i className="bi bi-download me-1"></i> Import Users
                </button>
              </div>
            </div> */}
            {/* <!-- Sales stats ends --> */}

          </div>
          {/* <!-- App Hero header ends -->

          <!-- App body starts --> */}
          <div className="app-body">

            {/* <!-- Row start --> */}
            <div className="row gx-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">

                    {/* <!-- Grid starts --> */}
                    <div className="table-outer mb-3">
                      <div className="table-responsive">
                        <table className="table table-hover table-striped align-middle mb-1">
                          <thead>
                            <tr> 
                              <th scope="col">User</th>
                              <th scope="col">Email</th>
                              <th scope="col">Phone</th>
                              <th scope="col">Role</th>
                              <th scope="col">Status</th>
                              <th scope="col">Joined Date</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>

                        { data.data.data.map((row: any, i: number) => (  
                                                
                            <tr key={i}> 
                              <td>
                                <div className="d-flex align-items-center">
                                  <img src="/uploads/dp.jpeg" className="rounded-circle me-2" width="40" alt="User" />
                                  <div>
                                    <h6 className="mb-0">{row.name}</h6>
                                    {/* <span className="text-muted small">@johnsmith</span> */}
                                  </div>
                                </div>
                              </td>
                              <td>{row.email}</td>
                              <td>{row.phone}</td>
                              <td><span className="badge rounded-0 bg-primary">Customer</span></td>
                              <td><span className="badge rounded-0 bg-success">Active</span></td>
                              <td>{
                                  new Intl.DateTimeFormat('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    timeZone: 'UTC'  
                                  }).format(new Date(row.created_at))
                              }
                            </td>
                              <td>
                                <div className="btn-group">
                                  
                                  <button type="button" className="btn btn-sm btn-outline-danger" data-bs-toggle="tooltip" aria-label="Delete Customer" data-bs-original-title="Delete Customer"
                                    onClick={async (e) => {
                                      e.stopPropagation();
          
                                      const result = await Swal.fire({
                                        title: "Delete Customer?",
                                        text: `Delete "${row.name}"? This cannot be undone.`,
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
                                            `/api/customers/delete/${row.id}`,
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
          
                                          return {
                                            ...current,
                                            data: current.data.filter(
                                              (c: any) => c.id !== row.id
                                            ),
                                          };
                                        },
                                        { revalidate: false }
                                      );
          
                                    }}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                 
                                </div>
                              </td>
                            </tr>
                             ))}
                            
                           
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* <!-- Grid ends --> */}

                    {/* <!-- Nav starts --> */}
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
                    {/* <!-- Nav ends --> */}

                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Row end -->

            */}
            
            {/* <!-- Toast message for download data example ends --> */}

          </div>
          {/* <!-- App body ends --> */}
 

        </div>
            


          
            <JqueryMin />
            <BootstrapBundle />
            <MomentMin />
            <OverlayScrollbarsInit /> 
            <CustomMin />
        </div>
    );
}


