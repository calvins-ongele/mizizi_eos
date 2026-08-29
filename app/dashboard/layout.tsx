import { Sidebar } from "./components/Sidebar";
import { getCurrentUser } from "../lib/getCurrentUser";
import { Navbar } from "./components/DashboardNav";
import { getCompany } from "../lib/getCompany";
import { getSuspendedOrders } from "../lib/getOrders";

const comp = await getCompany();
export const metadata = {
  title: `Dashboard | ${comp.name} `,
};

export default async function DashboardLayout({ children, }: { children: React.ReactNode; }) {
  const user = await getCurrentUser();
  const carts = await getSuspendedOrders();

  // Just in case middleware missed it
  if (!user) {
    return (
      <p className="mt-10 text-center">
        Unauthorized! <script>location.href='/'</script>
      </p>
    );
  }

  return (
    <section>
      {/* <!-- Page wrapper starts --> */}
      <div className="page-wrapper">
        {/* <!-- App header starts --> */}
        <Navbar user={user} company={comp} cart={carts} />
        {/* <!-- App header ends -->

      <!-- Main container starts --> */}
        <div className="main-container">
          <Sidebar/>
         

        {/*<!-- App container starts --> */}
          <div className="app-container">

            {children}
           
            {/* <!-- App footer starts --> */}
            <div className="app-footer fixed-footer" style={{position:"fixed", bottom:0, width:"100%", backgroundColor:"#f8f9fa", padding:"10px 0", textAlign:"center"}}>
              <span className="small">© {comp.name} {new Date().getFullYear()}</span>
            </div>
            {/* <!-- App footer ends --> */}
          </div>
          {/* <!-- App container ends --> */}
        </div>
        {/* <!-- Main container ends --> */}
      </div>
      {/* <!-- Page wrapper ends --> */}
    </section>
  );
}
