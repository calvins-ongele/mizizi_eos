import { LoginForm } from "@/app/LoginForm";
import { JqueryMin } from "@/app/components/JsClients";
import { getCompany } from "@/app/lib/getCompany";
const company = await getCompany();  

export const metadata = {
  title: `Login | ${company?.name??''}`,
};


export default function Home() {
  return (
    <section className="login-bg">
      <LoginForm cname={company['name']} logo={company['logo']} />
      <JqueryMin/>
    </section>
     
  );
}
