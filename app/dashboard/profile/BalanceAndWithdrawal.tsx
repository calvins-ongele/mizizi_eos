"use client"; 
import Loading from "@/app/components/Loading";
import useSWR from "swr"; 
 

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function BalanceAndWithdrawal() {
  

    
  const { data, mutate, isLoading } = useSWR(
    `/api/pos/account-balance`,
    fetcher
  );


async function launchBrowser(url:string) {
    try {
        const response = await fetch('/api/company/launch-browser', {method:"POST", body:JSON.stringify({
            url
        })});
    } catch (err) {
        console.error(err);
    }
}

 


  if (isLoading) return Loading({height:200});

    return (
        <>
         <div className=" gx-4 justify-content-center mb-5">
            {!data.success && (
                <div className="alert alert-danger" >{data?.message??''}</div>
            )}

            {data.success && (
            <section>
                <div className="mb-5 container d-flex justify-content-center align-items-center vh-100x">
                    <div className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center shadow" style={{width: "150px", height: "150px"}}>
                        <span className="fs-4 fw-bold">KES {data?.data?.message ?? 0}</span>
                    </div>
                </div>

                <a onClick={()=>launchBrowser(`https://www.miziziclassifieds.com/login/pos/${data?.data?.login_id ?? ''}`)}
                  className="btn form-control btn-success">Withdraw KES {data?.data?.message ?? 0} Now</a>
            </section>
            )}
 
         
        </div>
        </>
    );
}