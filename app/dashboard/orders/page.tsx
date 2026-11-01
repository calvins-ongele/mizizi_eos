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
import { toIso } from "../planifi/page";
import Swal from "sweetalert2";


const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function CustomersPage() {

  const [loading, setLoading] = useState(false); 
  const limit = 10;
  const [page, setPage] = useState(1);

  const { data, mutate, isLoading } = useSWR(
    `/api/pos/suspended`,
    fetcher
  );

  function formatDate(dateString: string) {
    const date = new Intl.DateTimeFormat('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    timeZone: 'UTC'  
                                  }).format(new Date(dateString));
    return date.toString().replace(/(\d{1,2}) (\w+) (\d{4})/, '$1\u00A0$2,\u00A0$3');
  }
    

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
                    <li className="breadcrumb-item"><a href="/dashboard/pos">Home</a></li> 
                    <li className="breadcrumb-item active" aria-current="page">Customers List</li>
                  </ol>
                </nav>
              </div>
            </div>
                   

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
                              <th scope="col">Customer</th>
                              <th scope="col">Email</th>
                              <th scope="col">Cart&nbsp;Value</th>
                              <th scope="col">Status</th>
                              <th scope="col">Date</th>
                              <th scope="col">Number</th>
                              <th scope="col">Paused&nbsp;by</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>

                        { data.data.map((row: any, i: number) => (  
                                                
                            <tr key={i}> 
                              <td>
                                <div className="d-flex align-items-center">
                                  <img src="/uploads/dp.jpeg" className="rounded-circle me-2" width="40" alt="User" />
                                  <div>
                                    <h6 className="mb-0">{row.customer_name || row.uid.slice(0, 7)}</h6>
                                    {/* <span className="text-muted small">@johnsmith</span> */}
                                  </div>
                                </div>
                              </td>
                              <td>{row.customer_phone}/{row.customer_email}</td> 
                              <td><span className="badge rounded-0 bg-primary">{row.cart_value || '0.00'}</span></td>
                              <td><span className="badge rounded-0 bg-warning">Paused</span></td>
                              <td>{
                                  formatDate(row.created_at)
                              }
                            </td>
                            <td>
                                {JSON.parse(row.cart_data)?.length || 0}
                            </td>
                            <td>{row.paused_by || "N/A"}</td>
                              <td>
                                <div className="btn-group">
                                  <a href={`/dashboard/pos/?uid=${row.uid}`} className="btn btn-sm btn-outline-primary">
                                    Continue
                                  </a>
                                 
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

            <!-- Modal --> */}
            <div className="modal fade" id="addNewUser" tabIndex={-1} aria-labelledby="addNewUserLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addNewUserLabel">
                      Add New User
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form id="newUserForm">
                      <div className="row g-4">
                        {/* <!-- Personal Information Section --> */}
                        <div className="col-12 mb-2">
                          <h6 className="fw-bold">Personal Information</h6>
                        </div>

                        {/* <!-- Profile Picture --> */}
                        <div className="col-12 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar-upload me-3">
                              <div className="mb-2">
                                <img src="assets/images/user.png" className="img-7x border border-2 rounded-circle" alt="Best Admin Template" />
                              </div>
                              <div className="mt-2">
                                <label htmlFor="profileImageUpload" className="btn btn-sm btn-outline-primary">
                                  <i className="bi bi-upload me-1"></i> Upload Photo
                                </label>
                                <input type="file" className="d-none" id="profileImageUpload" accept="image/*" />
                              </div>
                            </div>
                            <div className="small text-muted">
                              Recommended size: 200x200px<br/>
                              Max file size: 2MB<br />
                              Formats: JPG, PNG
                            </div>
                          </div>
                        </div>

                        {/* <!-- Personal Information Fields --> */}
                        <div className="col-md-6">
                          <label htmlFor="firstName" className="form-label">First Name <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" id="firstName" placeholder="Enter first name"  />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="lastName" className="form-label">Last Name <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" id="lastName" placeholder="Enter last name" />
                        </div>

                        {/* <!-- Username & Email --> */}
                        <div className="col-md-6">
                          <label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></label>
                          <div className="input-group">
                            <span className="input-group-text">@</span>
                            <input type="text" className="form-control" id="username" placeholder="username"  />
                          </div>
                          <div className="form-text">Username must be unique</div>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label">Email Address <span className="text-danger">*</span></label>
                          <input type="email" className="form-control" id="email" placeholder="name@example.com"   />
                        </div>

                        {/* <!-- Account Settings Section --> */}
                        <div className="col-12 mt-4 mb-2">
                          <h6 className="fw-bold border-bottom pb-2">Account Settings</h6>
                        </div>

                        {/* <!-- Role & Status with improved options --> */}
                        <div className="col-md-6">
                          <label htmlFor="role" className="form-label">User Role <span className="text-danger">*</span></label>
                          <select className="form-select" id="role"  >
                            <option value=""   >Select role</option>
                            <option value="admin">Administrator</option>
                            <option value="moderator">Moderator</option>
                            <option value="editor">Editor</option>
                            <option value="user">Standard User</option>
                            <option value="guest">Guest</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="statusActive" className="form-label">Account Status</label>
                          <div className="d-flex gap-3 mt-2">
                            <div className="form-check">
                              <input className="form-check-input" type="radio" name="accountStatus" id="statusActive" value="active" />
                              <label className="form-check-label" htmlFor="statusActive">Active</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" name="accountStatus" id="statusInactive" value="inactive" />
                              <label className="form-check-label" htmlFor="statusInactive">Inactive</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" name="accountStatus" id="statusPending" value="pending" />
                              <label className="form-check-label" htmlFor="statusPending">Pending</label>
                            </div>
                          </div>
                        </div>

                        {/* <!-- Password & Confirm Password with strength indicator --> */}
                        <div className="col-md-6">
                          <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
                          <div className="input-group">
                            <input type="password" className="form-control" id="password" />
                            <button className="btn btn-outline-light" type="button" >
                              <i className="bi bi-eye"></i>
                            </button>
                          </div>
                          <div className="progress mt-2 small">
                            <div className="progress-bar bg-danger w-0" role="progressbar" id="passwordStrength"></div>
                          </div>
                          <div className="form-text">Minimum 8 characters with letters, numbers, and special characters
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></label>
                          <div className="input-group">
                            <input type="password" className="form-control" id="confirmPassword" />
                            <button className="btn btn-outline-light" type="button"  >
                              <i className="bi bi-eye"></i>
                            </button>
                          </div>
                          <div id="passwordMatch" className="form-text"></div>
                        </div>

                        {/* <!-- Additional Information Section --> */}
                        <div className="col-12 mt-4 mb-2">
                          <h6 className="fw-bold border-bottom pb-2">Additional Information</h6>
                        </div>

                        {/* <!-- Phone & Department with improved input --> */}
                        <div className="col-md-6">
                          <label htmlFor="phone" className="form-label">Phone Number</label>
                          <input type="tel" className="form-control" id="phone" placeholder="+1 (123) 456-7890"  />
                          <div className="form-text">Format: +1 (123) 456-7890</div>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="department" className="form-label">Department</label>
                          <select className="form-select" id="department">
                            <option value="" >Select department</option>
                            <option value="it">IT &amp; Development</option>
                            <option value="hr">Human Resources</option>
                            <option value="sales">Sales</option>
                            <option value="marketing">Marketing</option>
                            <option value="finance">Finance</option>
                            <option value="operations">Operations</option>
                            <option value="support">Customer Support</option>
                          </select>
                        </div>

                        {/* <!-- Address with better structure --> */}
                        <div className="col-md-12">
                          <label htmlFor="address" className="form-label">Address</label>
                          <textarea className="form-control" id="address" rows={2}   placeholder="Street address, city, state, zip code"></textarea>
                        </div>

                        {/* <!-- Permissions Section --> */}
                        <div className="col-12 mt-4 mb-2">
                          <h6 className="fw-bold border-bottom pb-2">User Permissions</h6>
                        </div>
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-md-3 col-sm-6">
                              <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="viewDashboard" />
                                <label className="form-check-label" htmlFor="viewDashboard">View Dashboard</label>
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                              <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="manageUsers" />
                                <label className="form-check-label" htmlFor="manageUsers">Manage Users</label>
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                              <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="editContent" />
                                <label className="form-check-label" htmlFor="editContent">Edit Content</label>
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                              <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="viewReports" />
                                <label className="form-check-label" htmlFor="viewReports">View Reports</label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* <!-- Notification Settings --> */}
                        <div className="col-12 mt-4">
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="emailNotifications"  />
                            <label className="form-check-label" htmlFor="emailNotifications">Send email notifications</label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                      <i className="bi bi-x-circle me-1"></i> Cancel
                    </button>
                    <button type="button" className="btn btn-success" form="newUserForm">
                      <i className="bi bi-save me-1"></i> Save User
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
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


