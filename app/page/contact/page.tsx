"use client"; 
import { useState } from "react";  
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients"; 
import useSWR from "swr";
import { getCookies, setCookies } from "@/app/lib/manageCookies";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function ContactPage() {

    const { data, mutate, isLoading } = useSWR(`/api/content/fetch/products`,  fetcher );
    const currentYear = new Date().getFullYear();
    const [selected, setSelected] = useState(1000);
    const [selectedRow, setSelectedRow ] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [reloading, setReloading] = useState(false);
    const [feedbackData, setFeedbackData] = useState<any>({});
    const searchParams = useSearchParams();//get data 
    const uid = searchParams.get('uid') ?? '';
    const receipt = searchParams.get('receipt') ?? '';
    const orgName = searchParams.get('name') ?? '';

    async function submitForm(name = '') {
        setLoading(true);
        setSuccess('');
        setError('');
        const form = {
            email,
            name,
            phone,
            cart: [selectedRow]
        }

        if ( (phone.length < 1) || (email.length < 1) || (name.length < 1) ) {
            setError("All fields are required.");
            return;
        }
        if (!selectedRow) {
            setError("Please select an order plan to proceed.");
            return;
        }

        try {
            const response = await fetch('/api/pos/purchase-front-end', {method:"POST", body:JSON.stringify( form )});
            const result = await response.json();

            if (result.success) {
                setSuccess("Order saved successfully. Please proceed to pay.");
                setFeedbackData(result.data);
                sendSTK();
                setTimeout(()=> {  
                    //location.href=`/page/success?receipt=${result?.data?.receipt_no??''}&uid=${result?.data?.uid ??''}&name=${name}`;
                }, 1000)
                return;
            } 
            setError(result.message);

        } catch(e) {}
        finally{
            setLoading(false);
        }

    }



    
  function MakeForm( ) {
    return { 
        cartValue: feedbackData.amount,
        mode_of_payment: 'Mpesa_STK',
        uid: feedbackData.uid,
        sale_id: feedbackData.sale_id,
        receipt_no: feedbackData.receipt_no||'',
        customer_name:name||'',
        customer_email:email||'',
        customer_phone:phone||'',
        cash_amount: feedbackData.amount || 0,
        paybill: feedbackData.paybill??'',
        account_no:feedbackData.account_no??'',
        phone
    }
  }
  async function sendSTK( ) { 
     
    setLoading(true);
    try {
      if (phone.length < 10) {
        setError("Please include a valid phone number");
        return;
      }
 
    
      const form = MakeForm( );
      
      const response = await fetch("/api/pos/sendstk",{method:"POST", body:JSON.stringify(form)});
      const results = await response.json();
      if (results.success) { 
        const msg = results.data.msg;
        const ordernumber = `${results.data.ordernumber}`;
        //setOrderNumber(ordernumber); 
        await setCookies("order_number", `${ordernumber}`);
        setSuccess("STK sent to customer successfully.");
        //activate rechecks
        console.log("START::::::::::::", ordernumber);
        fetchingTask();
        return;
      }
      setError(`${results.message||"An error occurred"}`);


    } catch (er) {

    } finally {
      setLoading(false);
    }
  }

    const fetchingTask = async () => {
      const orderNumber = await getCookies("order_number");
       
          if (reloading) return;
          setReloading(true);
          let isContinue = true;

          try { 
            
              const recheck = await fetch(`https://www.api.miziziclassifieds.com/requests/confirm-deposit`, {method:"POST", body:JSON.stringify({order_number:orderNumber})});

              //
              const result = await recheck.json();
              console.log("RESSS::::::::", result);
              
              if (result.error == 'false') {
                // payment done and confirmed 
                setSuccess("Sale completed successfully.");
                //print receipt
                
                const form = MakeForm();

                const resp = await fetch("/api/pos/completesale",{method:"POST", body:JSON.stringify(form)});
                isContinue = false;
                return;
              } else {
                //isContinue = false;
                setError(`${result?.msg || "Something went wrong"}`);
                if (result?.continue == 'no') isContinue = false;
              }

            
          } catch (err) {
              console.error("Task failed", err);
          } finally {
              // Gate always opens, even on failure 
              setReloading(false);
              // Schedule the NEXT run only after this one is totally done
              if (isContinue)
              setTimeout(fetchingTask, 1000);
          }
      };

 
    if (isLoading) return;
    
    const products = data.data.products; 
    const content = data.data.content;

    function onSelected(index:number, row:any) {
        setSelected(index);
        row.price = row.price_per_unit;
        row.qty = 1;
        setSelectedRow(row);
    }

    //   "data": [
    //     {
    //         "barcode": "BC-BLC-50",
    //         "product_definition_id": 1,
    //         "product_name": "Fanta Blackcurrent 500ml",
    //         "price_per_unit": "80.00",
    //         "cost_price": "62.00",
    //         "quantity_available": "70"
    //     },

return ( 
<section style={{backgroundColor: "#f7f7f7", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: "#333" }}>
    

    {/* <!-- Header / Hero Section --> */}
    <header className="hero-header text-center">
        <div className="container" style={{maxWidth: "900px;"}}>
            <h1 className="fw-bold fs-3 mb-3">Clinical & Evidence-Based (Grounded in CBT/ACT)</h1>
            <p className="mb-3 text-light opacity-90 fs-6">
                A clinical, self-paced guide to transforming performance anxiety and more into psychological safety, helping you accross many things including clarity and self-assurance across all professional and personal domains.
            </p>
            <p className="fw-semibold mb-0 fs-6">Enter your details below to proceed.</p>
        </div>
    </header>

    {/* <!-- Main Content Section --> */}
    <main className="container main-content">
        <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
                <div className="checkout-card">
                    <div className="row g-4">
                        
                        {/* <!-- Left Column: Form Details --> */}
                        <div className="col-md-7 pe-md-4">
                            <form>
                                {/* <!-- Customer Information --> */}
                                <div className="mb-4">
                                    <h5 className="fw-bold fs-6 mb-3">Customer information</h5>
                                    <div>
                                        <input type="email" className="form-control input-error" id="email" placeholder="Email Address *"
                                        onChange={(e)=>setEmail(e.target.value)}
                                         />
                                        <div className="error-message">Email Address is required</div>
                                    </div>
                                </div>

                                {/* <!-- Billing Details --> */}
                                <div className="mb-4">
                                    <h5 className="fw-bold fs-6 mb-3">Billing details</h5>
                                    <div className="row g-2 mb-3">
                                        <div className="col-12">
                                            <input type="text" className="form-control" placeholder="Full name *"
                                            onChange={(e)=>setName(e.target.value)} />
                                        </div>
                                        
                                    </div>
                                    <div>
                                        <input type="tel" className="form-control" placeholder="Phone *" 
                                        onChange={(e)=>setPhone(e.target.value)}/>
                                    </div>
                                </div>

                                {/* <!-- Payment Section --> */}
                                <div className="mb-4">
                                    <h5 className="fw-bold fs-6 mb-3">Payment</h5>
                                    <div className="payment-box">
                                        <div className="payment-header text-secondary">
                                            Debit/Credit Cards
                                        </div>
                                        <div className="payment-body text-center">
                                            <div className="text-secondary small mb-2">
                                                <i className="fa-solid fa-lock me-1"></i> Secured by <strong>Mizizi Classifieds</strong>
                                            </div>
                                            {/* <!-- Payment Badge Icons Placeholder --> */}
                                            <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap fs-5 text-muted">
                                                <i className="fa-brands fa-cc-visa text-primary"></i>
                                                <i className="fa-brands fa-cc-mastercard text-warning"></i>
                                                <i className="fa-brands fa-cc-amex text-info"></i>
                                                <span className="badge bg-success-subtle text-success border border-success px-2 py-1 fs-6">M-PESA</span>
                                                <i className="fa-brands fa-apple text-dark"></i>
                                            </div>
                                        </div>
                                        <div className="payment-footer text-muted">
                                            Make payment using your debit and credit cards
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Privacy Policy Note --> */}
                                <p className="privacy-text mb-4">
                                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                                </p>

                                {/* <!-- Submit Button --> */}
                                <button type="button" disabled={loading} onClick={()=>submitForm(content?.org?.institution_name ?? '') } className="btn btn-checkout w-100 mb-2">
                                    <i className="fa-solid fa-lock me-1"></i> Place Order KSh {selectedRow?.price_per_unit ?? ''}
                                </button>

                                {error && (<div className="alert alert-danger">{error}</div>)}
                                {success && (<div className="alert alert-success">{success}</div>)}


                            </form>
                        </div>

                        {/* <!-- Right Column: Order Summary --> */}
                        <div className="col-md-5 ps-md-4 border-start-md">
                            <h5 className="fw-bold fs-6 mb-3">Your order | Select One</h5>
                            
                            <div className="table-responsive">
                            <table className="table order-tablex mb-0">
                                <thead>
                                    <tr >
                                        <th scope="col" className="border-0">Product</th>
                                        <th scope="col" className="border-0 text-end">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((row:any, idx:number)=> (

                                        
                    <tr key={row?.barcode} onClick={()=>onSelected(idx, row)}  >
                        <td className={`align-middle ${idx === selected?'bg-grey':''} `}>
                            <div className="d-flex align-items-center  ">
                                {/* <img src="https://via.placeholder.com/40" alt="Thumbnail" className="rounded me-2" style={{width: "40px", height: "40px", objectFit: "cover"}} /> */}
                                <span className="small lh-sm">{row?.product_name ?? ''} <span className="text-muted fw-normal">
                                    {/* × 1 */}
                                    </span></span>
                            </div>
                        </td>
                        <td className={`text-end align-middle fw-medium ${idx === selected?'bg-grey':''}`}>KSh {row?.price_per_unit ?? ''}</td>
                    </tr>

                                    ))}
                                  
                                    <tr>
                                        <td className="fw-bold fs-6 border-0">Total</td>
                                        <td className="text-end fw-bold fs-6 border-0"
                                        >KSh {selectedRow?.price_per_unit ?? ''}</td>
                                    </tr>
                                </tbody>
                                
                            </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </main>

    {/* <!-- Footer --> */}
    <footer className="text-center py-3">
        <div className="container">
            <p className="mb-0 small opacity-75">
                © {currentYear},{content?.org?.institution_name},All Rights Reserved.
            </p>
        </div>
    </footer>


            <JqueryMin />
            <BootstrapBundle />
            <MomentMin />
            <OverlayScrollbarsInit /> 
            <CustomMin />
</section>

 
)
}