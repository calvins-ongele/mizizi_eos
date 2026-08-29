 
import { getCompany } from "./lib/getCompany";
const company = await getCompany(); 

export const metadata = {
  title: `Not Found | ${company?.nane ?? ''}`,
};


export default function Home() {
  return (
    <section className=" error-screen bg-light">
      <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-9">
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
              <h1 className="error-title text-black mb-4">404</h1>
              <h3 className="mb-5">
                Oopps. The page you were looking for doesn't exist.
              </h3>
              <a href="/dashboard" className="btn btn-black rounded-pill px-5 shadow-lg py-3 fs-5">Go back to dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
     
  );
}