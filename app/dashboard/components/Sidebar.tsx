import Link from "next/link";
import { IconLogoutBtn } from "@/app/dashboard/components/Logout";
import { headers } from "next/headers";


export async function Sidebar() { 

const headersList = await headers();
const pathname = headersList.get("x-pathname") || ''; 

  return (
    <aside className="w-56 dashbsidebar">
      {/* <!-- Sidebar wrapper starts --> */}
      <nav id="sidebar" className="sidebar-wrapper">
        {/* <!-- Sidebar menu starts --> */}
        <div className="sidebarMenuScroll">
          <ul className="sidebar-menu">
            <li className="sidebar-title">
              <h6 className="m-0 text-truncate small">Dashboards</h6>
            </li>
            <li className={`${pathname === "/dashboard" ? "current-page " : ""}`}>
              <a href="/dashboard">
                <i className="bi bi-pie-chart"></i>
                <span className="menu-text">Dashboard</span>
              </a>
            </li>
            <li className={`${pathname === "/dashboard/pos" ? "current-page " : ""} mt-3`}>
              <a href="/dashboard/pos">
                <img src="/system/mizizi-pos.png" alt="pos" style={{ width: '20px', height: '20px' }} />
                <span className="menu-text mx-2">POS</span>
              </a>
            </li>
            {/* <li>
              <a href="widgets.html">
                <i className="bi bi-box"></i>
                <span className="menu-text">UI Widgets</span>
              </a>
            </li> */}
            <li className="sidebar-title">
              <h6 className="m-0 text-truncate small">Pages</h6>
            </li>
            <li className={`${pathname === "/dashboard/customers" ? "current-page " : ""}`}>
              <a href="/dashboard/customers">
                <i className="bi bi-people"></i>
                <span className="menu-text">Customers</span>
              </a>
            </li>
            <li className={`${pathname === "/dashboard/orders" ? "current-page " : ""}`}>
              <a href="/dashboard/orders">
                <i className="bi bi-minecart-loaded"></i>
                <span className="menu-text">Orders</span>
              </a>
            </li>
            <li className={`${pathname === "/dashboard/sales" ? "current-page " : ""}`}>
              <a href="/dashboard/sales">
                <i className="bi bi-graph-up"></i>
                <span className="menu-text">Sales</span>
              </a>
            </li>
           
            <li className={`${pathname === "/dashboard/expenses" ? "current-page " : ""}`}>
              <a href="/dashboard/expenses">
                <i className="bi bi-arrow-up-right-circle"></i>
                <span className="menu-text">Expenses</span>
              </a>
            </li>

            <li className={ `treeview ${pathname.startsWith("/dashboard/products") ? "active current-page " : ""} ` }>
              <a href="#!">
                <i className="bi bi-cart"></i>
                <span className="menu-text">Products</span>
              </a>
              <ul className="treeview-menu">
                <li><a href="/dashboard/products/categories">Categories</a></li>
                <li><a href="/dashboard/products/units">Units</a></li>
                <li><a href="/dashboard/products/stock-count">Stock Count</a></li>
                <li>
                  <a href="#!">
                    Product Definitions
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul className="treeview-menu">
                    <li><a href="/dashboard/products/definitions/create">Create</a></li> 
                    <li><a href="/dashboard/products/definitions">View</a></li> 

                    <li>
                      <a href="#!">
                        Return Items
                        <i className="bi bi-chevron-right"></i>
                      </a>
                      <ul className="treeview-menu">
                        <li>
                          <a href="/dashboard/products/definitions/return-reasons">Manage Reasons</a>
                        </li>
                        <li>
                          <a href="/dashboard/products/definitions/return-items">Return Item</a>
                        </li>
                      </ul>
                    </li>

 
                  </ul>
                </li>
                <li>
                  <a href="#!">
                    Purchases
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul className="treeview-menu">
                    <li><a href="/dashboard/products/purchases/create">Create</a></li> 
                    <li><a href="/dashboard/products/purchases">View</a></li> 
                  </ul> 
                </li>
                <li>
                  <a href="/dashboard/products/suppliers">Suppliers</a>
                </li>
                <li>
                  <a href="/dashboard/products/labels">Labels</a>
                </li>
              </ul>
            </li>

            <li className={ `treeview ${pathname.startsWith("/dashboard/invoices") ? "active current-page " : ""} ` }>
              <a href="#!">
                <i className="bi bi-window-sidebar"></i>
                <span className="menu-text">Invoices</span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="/dashboard/invoices/create">Create Invoice</a>
                </li>
                <li>
                  <a href="/dashboard/invoices">View Invoice</a>
                </li> 
              </ul>
            </li>
            <li className={ `treeview ${pathname.startsWith("/dashboard/planifi") ? "active current-page " : ""} ` }>
              <a href="#!">
                <i className="bi bi-calendar"></i>
                <span className="menu-text">PlaniFi</span>
              </a>
              <ul className="treeview-menu">
                {/* <li>
                  <a href="/dashboard/planifi/create">Create Schedule</a>
                </li> */}
                <li>
                  <a href="/dashboard/planifi">Manage Calendar</a>
                </li> 
              </ul>
            </li>
            <li className={ `treeview ${pathname.startsWith("/dashboard/users") ? "active current-page " : ""} ` }>
              <a href="#!">
                <i className="bi bi-shield-check"></i>
                <span className="menu-text">Users</span>
              </a>
              <ul className="treeview-menu">
                {/* <li>
                  <a href="/dashboard/planifi/create">Create Schedule</a>
                </li> */}
                <li>
                  <a href="/dashboard/users">Manage system users</a>
                </li> 
              </ul>
            </li>
            <li className={ `treeview ${pathname.startsWith("/dashboard/content") ? "active current-page " : ""} ` }>
              <a href="#!">
                <i className="bi bi-file-check-fill"></i>
                <span className="menu-text">Main Page Content</span>
              </a>
              <ul className="treeview-menu"> 
                <li>
                  <a href="/dashboard/content/edit">Edit</a>
                </li> 
              </ul>
            </li>

            {/* <li>
              <a href="support.html">
                <i className="bi bi-chat-text"></i>
                <span className="menu-text">Support</span>
              </a>
            </li>
            <li>
              <a href="contacts.html">
                <i className="bi bi-buildings"></i>
                <span className="menu-text">Contacts</span>
              </a>
            </li> */}
          </ul>
        </div>
        {/* <!-- Sidebar menu ends -->

          <!-- Sidebar settings starts --> */}
        <div className="sidebar-settings gap-1 d-lg-flex d-none">
          <a
            href="/dashboard/profile"
            className="settings-icon"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Profile"
          >
            <i className="bi bi-person"></i>
          </a>
          <a
            href="/dashboard/settings"
            className="settings-icon"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
          </a>

          <IconLogoutBtn />
        </div>
        {/* <!-- Sidebar settings ends --> */}
      </nav>
      {/* <!-- Sidebar wrapper ends -->*/}
    </aside>
  );
}
