import { LogoutButton } from "@/app/dashboard/components/Logout"; 

export async function Navbar({ user, company, cart }: any) {
 
   
  return (
    <header className="border-b bg-white sticky-top">
      <div className="app-header d-flex align-items-center">
        {/* <!-- Pin Sidebar starts --> */}
        <div className="pin-sidebar me-2">
          <button type="button" className="btn btn-primary rounded-2">
            <i className="bi bi-list"></i>
          </button>
        </div>
        {/* <!-- Pin Sidebar ends -->
      
              <!-- Mobile Sidebar starts --> */}
        <div className="toggle-sidebar me-2">
          <button type="button" className="btn btn-primary rounded-2">
            <i className="bi bi-list"></i>
          </button>
        </div>
        {/* <!-- Mobile Sidebar ends -->
      
              <!-- App brand starts --> */}
        <div className="app-brand d-flex align-items-center p-2">
          {/* <!-- Default screen starts --> */}
          <a href="/dashboard" className="d-lg-flex d-none">
            <img
              src={company.logo}
              className="logo"
              alt={company.name}
            />
          </a>
          {/* <!-- Default screen end -->
      
                <!-- Logo sm starts --> */}
          <a href="/dashboard" className="d-lg-none">
            <img
              src={company.logo}
              className="logo-sm"
              alt={company.name}
            />
          </a>
          {/* <!-- Logo sm end --> */}
        </div>
        {/* <!-- App brand ends -->
      
              <!-- App header actions starts --> */}
        <div className="header-actions">
          {/* <!-- Search container starts --> */}
          <div className="search-container d-lg-block d-none me-3">
            <input
              type="text"
              className="form-control"
              id="searchAny"
              placeholder="Search"
            />
            <i className="bi bi-search"></i>
          </div>
          {/* <!-- Search container ends -->
      
                <!-- Actions block starts --> */}
          <div className="d-lg-flex d-none gap-3 actions-block">
            <div className="dropdown">
              <a
                className="dropdown-toggle action-icon"
                href="#!"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-cart2 lh-1"></i>
                <span className="count-label">{cart?.data?.length ?? 0}</span>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-300">
                <div className="dropdown-header fw-semibold">Orders</div>
                <div className="scroll250">
                  <div className="d-grid gap-3 p-3">
                    {/* <!---------------------------> */} 
                    { cart?.data?.map((row: any, i: number) => (  

                    <div className="order-item border-bottom pb-3" key={row.uid}>
                      <a href={`/dashboard?uid=${row.uid}`}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge border border-primary text-primary rounded-pill">
                          {row.customer_name || row.uid.slice(0, 8)} 
                        </span>
                        <small className="text-muted">
                          {
                              new Intl.DateTimeFormat('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                timeZone: 'UTC'  
                              }).format(new Date(row.created_at))
                          }
                        </small>
                      </div>
                      <p className="fw-medium mb-1">
                        Total value - KES{row.cart_value}
                      </p>
                      <p className="small text-muted m-0">
                        Order #{row.uid.slice(0, 7)} • Paused
                      </p>
                      </a>
                    </div>
                   ))}
                    {/* ---------------------------------- */}

                    {/* <div className="order-item border-bottom pb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-primary rounded-pill">
                          Account
                        </span>
                        <small className="text-muted">Today, 03:00pm</small>
                      </div>
                      <p className="fw-medium mb-1">
                        $180 deducted from your account
                      </p>
                      <p className="small text-muted m-0">
                        Transaction #95622 • Completed
                      </p>
                    </div>

                    <div className="order-item border-bottom pb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-success rounded-pill">
                          Team
                        </span>
                        <small className="text-muted">Today, 03:15pm</small>
                      </div>
                      <p className="fw-medium mb-1">Daniel joined the team</p>
                      <p className="small text-muted m-0">
                        Sales Department • New member
                      </p>
                    </div>

                    <div className="order-item border-bottom pb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-info rounded-pill">
                          Orders
                        </span>
                        <small className="text-muted">Today, 03:30pm</small>
                      </div>
                      <p className="fw-medium mb-1">Smart Watch - $249</p>
                      <p className="small text-muted m-0">
                        Order #34527 • Shipped
                      </p>
                    </div> */}

                    {/* <div className="order-item">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-warning text-dark rounded-pill">
                          New
                        </span>
                        <small className="text-muted">Today, 03:45pm</small>
                      </div>
                      <p className="fw-medium mb-1">Bluetooth Speaker - $85</p>
                      <p className="small text-muted m-0">
                        Order #34531 • Payment received
                      </p>
                    </div> */}
                  </div>
                </div>
                <div className="d-grid m-3">
                  <a href="/dashboard/orders" className="btn btn-primary">
                    View all
                  </a>
                </div>
              </div>
            </div>
            {/* <div className="dropdown">
              <a
                className="dropdown-toggle action-icon"
                href="#!"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-exclamation-triangle lh-1"></i>
                <span className="count-label">5</span>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-300">
                <div className="dropdown-header fw-semibold">Errors</div>
                <div className="scroll250">
                  <div className="d-grid gap-2 m-3">
                 
                    <div className="border px-3 py-2 rounded-2">
                      <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-circle-fill text-danger mt-1"></i>
                        <div>
                          <p className="mb-1">
                            Critical error reported in signup flow
                          </p>
                          <p className="small m-0 text-muted">
                            Today, 10:45 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-grid m-3">
                  <a href="javascript:void(0)" className="btn btn-primary">
                    View all
                  </a>
                </div>
              </div>
            </div> */}
            {/* <div className="dropdown">
              <a
                className="dropdown-toggle action-icon"
                href="#!"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-receipt lh-1"></i>
                <span className="count-label animate__animated animate__swing animate__infinite">
                  6
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-300">
                <div className="dropdown-header fw-semibold">Invoices</div>
                <div className="scroll250">
                  <div className="d-grid gap-2 p-3">
       
                    <a href="#!">
                      <div className="d-flex align-items-center py-2">
                        <img
                          src="assets/images/user1.png"
                          className="img-3x me-3 rounded-5"
                          alt="Admin Theme"
                        />
                        <div>
                          <h4 className="mb-2">$720.00</h4>
                          <p className="mb-1">
                            Zentra Corp transferred funds for software upgrade.
                          </p>
                          <p className="m-0">
                            Invoice #10234
                            <span className="badge bg-success ms-2">Paid</span>
                          </p>
                        </div>
                      </div>
                    </a> 

                  </div>
                </div>
                <div className="d-grid m-3">
                  <a href="javascript:void(0)" className="btn btn-primary">
                    View all
                  </a>
                </div>
              </div>
            </div> */}
          </div>
          {/* <!-- Actions block ends -->
      
                <!-- Settings start --> */}
          <div className="dropdown ms-3">
            <a
              id="userSettings"
              className="dropdown-toggle d-flex align-items-center py-1 avatar-box"
              href="#!"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={user.dp}
                className="rounded-circle img-3x"
                alt={company.name}
              />
              <span className="status online"></span>
            </a>
            <div className="dropdown-menu dropdown-menu-end shadow-lg p-3">
              <div className="user-header d-flex align-items-center mb-3">
                <img
                  src={user.dp}
                  className="rounded-circle img-3x me-2"
                  alt="Modern Admin Dashboard"
                />
                <div>
                  <h6 className="mb-0 fw-semibold">{user.name}</h6>
                  <small className="text-muted">{user.role}</small>
                </div>
              </div>
              <a
                className="dropdown-item d-flex align-items-center py-2 border mb-1"
                href="/dashboard/profile"
              >
                <i className="bi bi-person-circle me-2 text-primary"></i>
                <span>My Profile</span>
              </a>
              <a
                className="dropdown-item d-flex align-items-center py-2 border mb-1"
                href="/dashboard/settings"
              >
                <i className="bi bi-gear-fill me-2 text-primary"></i>
                <span>Account Settings</span>
              </a>
              <a
                className="dropdown-item d-flex align-items-center justify-content-between py-2 border mb-1"
                href="/dashboard/tasks"
              >
                <div>
                  <i className="bi bi-list-check me-2 text-primary"></i>My Tasks
                </div>
                <span className="badge bg-primary rounded-pill">5</span>
              </a>
              <a
                className="dropdown-item d-flex align-items-center py-2 border"
                href="/dashboard/reset-password"
              >
                <i className="bi bi-shield-lock me-2 text-primary"></i>
                <span>Reset Password</span>
              </a>
              <div className="d-grid mt-2">
                <LogoutButton />
                 
              </div>
            </div>
          </div>
          {/* <!-- Settings end --> */}
        </div>
        {/* <!-- App header actions ends --> */}
      </div>
    </header>
  );
}
