"use client";

import Loading from "@/app/components/Loading"; 
import { getCookies, setCookies } from "@/app/lib/manageCookies";
import { useState } from "react";
 

interface InvoiceModalProps {
  enquiry: PayType;
  onClose: () => void;
  onSave: (data: any) => void; // Added callback prop
}

export default function PayModal({ enquiry, onClose, onSave }: InvoiceModalProps) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [reloading, setReloading] = useState(false);
  //const [orderNumber, setOrderNumber] = useState("");


  function activeModal() {
    onClose();
    setOpen(false);
  }


  async function sendSTK() { 
     
    setLoading(true);
    try {
      if (phone.length < 10) {
        setError("Please include a valid phone number");
        return;
      }
 
      const form = {
        cartValue: enquiry.amount,
        mode_of_payment: 'Mpesa_STK',
        uid: enquiry.uid,
        sale_id: enquiry.sale_id,
        receipt_no: enquiry.receipt_number||'',
        customer_name:enquiry.customer_name||'',
        customer_email:enquiry.customer_email||'',
        customer_phone:enquiry.customer_phone||'',
        cash_amount: enquiry.amount || 0,
        paybill: enquiry.paybill,
        account_no:enquiry.account_no,
        phone,
        dashboard:"yes"
      }
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
      console.log("Here::::::::::::", orderNumber);
      //setError("");
      //setSuccess("");
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
                onSave("");  
                activeModal();
                setSuccess("Sale completed successfully.");
                //print receipt
                
                const form = {
                  cartValue: enquiry.amount,
                  mode_of_payment: 'Mpesa_STK',
                  uid: enquiry.uid,
                  sale_id: enquiry.sale_id,
                  receipt_no: enquiry.receipt_number||'',
                  customer_name:enquiry.customer_name||'',
                  customer_email:enquiry.customer_email||'',
                  customer_phone:enquiry.customer_phone||'',
                  cash_amount: enquiry.amount || 0,
                  paybill: enquiry.paybill,
                  account_no:enquiry.account_no,
                  phone,
                  dashboard:"yes"
                }

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

   
  

  async function paidViaCash() {
     
    setLoading(true);
    try {
      if (cashAmount.length == 0) {
        setError("Please include the cash amount");
        return;
      }
    const form = {
      cartValue: enquiry.amount,
      mode_of_payment: 'Cash',
      uid: enquiry.uid,
      sale_id: enquiry.sale_id,
      receipt_no: enquiry.receipt_number||'',
      customer_name:enquiry.customer_name||'',
      customer_email:enquiry.customer_email||'',
      customer_phone:enquiry.customer_phone||'',
      cash_amount: cashAmount || 0,
    }
    const response = await fetch("/api/pos/completesale",{method:"POST", body:JSON.stringify(form)});
    const type = response.headers.get("X-Response-Type")||"";
    //const type = response.headers.get("content-type") || "";
    //if (type.includes("application/pdf")) {
    if (type === 'pdf') {  
      const blob = await response.blob(); 
      const url = URL.createObjectURL(blob);
      setSuccess("Sale completed successfully."); 
      onSave(url);  
      activeModal(); 
      return;
    }  
    const results = await response.json();
    if (results.success) {
      onSave("");  
      activeModal();
      setSuccess("Sale completed successfully.");
      return;
    }
    setError(`${results.message||"An error occurred"}`);
  } catch(e) {}
  finally {
    setLoading(false);
  }
  }

  return (
    <div className={open ? "show vmodal" : "remove vmodal"}>
      <div className="vmodal-backdrop"></div>
      <div className="vmodal-dialog">
        <div className="vmodal-header">
          <h2 className="vmodal-title">Add Payment Details</h2>
          <button className="vmodal-close" onClick={activeModal}>&times;</button>
        </div>

        <div className="vmodal-body"> 
            <nav>
            <div
              style={{ maxHeight: "20px" }}
              className="nav nav-tabs"
              id="nav-tab"
              role="tablist"
            >
              <button
                className="nav-link active"
                id="nav-stk-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-stk"
                type="button"
                role="tab"
                aria-controls="nav-stk"
                aria-selected="true"
              >
                Mpesa STK Push
              </button>
              <button
                className="nav-link"
                id="nav-paybill-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-paybill"
                type="button"
                role="tab"
                aria-controls="nav-paybill"
                aria-selected="false"
              >
                MPesa Paybill
              </button>
              <button
                className="nav-link"
                id="nav-cash-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-cash"
                type="button"
                role="tab"
                aria-controls="nav-cash"
                aria-selected="false"
              >
                Cash
              </button>
            
              <button
                className="nav-link"
                id="nav-card-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-card"
                type="button"
                role="tab"
                aria-controls="nav-card"
                aria-selected="false"
              >
                Card
              </button>
            </div>
          </nav>

          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-stk"
              role="tabpanel"
              aria-labelledby="nav-stk-tab"
              tabIndex={0}
            >
              <div
                className="card"
                style={{ maxHeight: "300px", overflow: "auto" }}
              >
                <hr></hr>
                <h5 className="card-header ">Prompt the customer for payment</h5>
                <div className="card-body">
                  <div>
                    
                        <div className="col-md-12 mb-3">
                          <div className="form-group">
                            <label className="form-label font-bold">
                              Customer's Phone Number
                            </label>
                            <input
                              type="text" 
                              name="number"
                              className="form-control form-control-lg"
                              placeholder="ie 07xxxx"
                              required={true} autoFocus={true}
                              defaultValue={enquiry.customer_phone}
                              onChange={(e)=>setPhone(e.target.value)}
                            />
                          </div>
                        </div> 
                        <div className="col-md-12 mb-3">
                          <div className="form-group">
                            <label className="form-label font-bold">
                              Amount to Pay
                            </label>
                            <input
                              type="text" readOnly={true}  
                              className="form-control form-control-lg" 
                              defaultValue={enquiry.amount}
                            />
                          </div>
                        </div> 
                     
                     

                    <div className="message-box"> </div>
                  </div>
                </div>
              </div>
              

              <div className="modal-footer">

                {loading && (
                    <Loading  height={50} />
                  )}
                    {!loading && (
                    
                  <button type="button" className="btn btn-success" onClick={()=>sendSTK()}>
                    Send STK Push
                  </button>

                )} 
                <div className="actions"></div>
              </div>
            </div>
            {/* paybill -- self */}
            <div
              className="tab-pane fade"
              id="nav-paybill"
              role="tabpanel"
              aria-labelledby="nav-paybill-tab"
              tabIndex={0}
            >
              <div
                className="card"
                style={{ maxHeight: "300px", overflow: "auto" }}
              >
                <div className="card-bodyx mt-3">
                   
                  <div className="mt-3">  
                        {/* <!----------st----------------> */}
                        
                        <div className="col-md-12 mb-3">
                          <h5>Customer Should:</h5>
                          <ol>
                            <li>Go to Lipa na Mpesa and select Paybill</li>
                            <li>Enter Paybill <strong>{enquiry.paybill}</strong></li>
                            <li>Enter account number <strong>{enquiry.account_no}</strong></li>
                            <li>Amount: <strong>KES {enquiry.amount}</strong></li>
                            <li>Proceed with prompts and Enter M-pesa pin</li>
                          </ol>
                        </div> 
                         
                  </div>
                </div>
              </div>
            </div>

            {/* cash */}
            
            <div
              className="tab-pane fade"
              id="nav-cash"
              role="tabpanel"
              aria-labelledby="nav-cash-tab"
              tabIndex={0}
            >
              <div
                className="cardx"
                style={{ maxHeight: "300px", overflow: "auto" }}
              ><hr></hr>
                <div className="card-body mt-3">
                   
                  <div className="mt-3">  
                        {/* <!----------st----------------> */} 
                        <div className="col-md-12 mb-5 mt-5"> 

                          <div className="mb-3">
                            <label>Amount Due</label>
                            <input className="form-control "  style={{background:"grey",fontSize:"40px"}}
                            defaultValue={`KES ${enquiry.amount}`}  readOnly={true}
                            />
                          </div>
                          <div className="mb-3">
                            <label>Amount Received</label>
                            <input className="form-control "  autoFocus={true}
                            onChange={(e) => {
                            setCashAmount(e.target.value); 
                          }}
                            />
                          </div>

                           <div className="d-flex justify-content-center">
                            {loading && (
                              <Loading />
                            )}
                             {!loading && (
                             <button  
                             onClick={()=>paidViaCash()}
                             className="form-control btn btn-success" >Paid Via Cash?</button>
                             )}
                           </div> 
                        </div> 
 
                  </div>
                </div>
              </div>
            </div>
            {/* card */}
            
            <div
              className="tab-pane fade"
              id="nav-card"
              role="tabpanel"
              aria-labelledby="nav-card-tab"
              tabIndex={0}
            >
              <div
                className="cardx"
                style={{ maxHeight: "300px", overflow: "auto" }}
              ><hr></hr>
                <div className="card-body mt-3">
                   
                  <div className="mt-3">  
                        {/* <!----------st----------------> */} 
                        <div className="col-md-12 mb-5 mt-5"> 
                           <div className="d-flex justify-content-center">
                             <h2  className=" " >Coming Soon!</h2>
                           </div> 
                        </div>   
 
                  </div>
                </div>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="nav-disabled"
              role="tabpanel"
              aria-labelledby="nav-disabled-tab"
              tabIndex={0}
            >
             
             
            </div>
          </div>


      
      
            {/* Footer */}
        
            <div className="mt-1"> 
                {error && (
                <p className="alert alert-sm text-danger">{error}</p>
                )}
                {success && (
                <p className="alert alert-sm text-success">{success}</p>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}