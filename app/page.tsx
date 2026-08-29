import { LoginForm } from "./LoginForm";
import { JqueryMin } from "./components/JsClients";
import { getCompany } from "./lib/getCompany";
import OutsideMainPage from "./page/page";
const company = await getCompany();  

export const metadata = {
  title: `${process.env.ALONY === "Y"?"Home":"Login"} | ${company?.name??''}`,
  icons:   `${company?.logo??''}`
};


export default function Home() {
  return (
    <section className="login-bg">
      {process.env.ALONY === "Y" && (
        <OutsideMainPage />
      )}
      {process.env.ALONY !== "Y" && (
        <LoginForm cname={company['name']} logo={company['logo']} />
      )}
        
      <JqueryMin/>
    </section>
     
  );
}
