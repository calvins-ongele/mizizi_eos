"use client"

import { Toast } from "@/app/components/Toast";
import { useState } from "react";



export default function InvoiceModal({enquiry,onClose}: {
  enquiry: InvoiceModalType;
  onClose: () => void;
}) {
    const [open, setOpen] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function activeModal() {
        onClose();
        setOpen(false);
    }
     
    async function createCustomer(e:any) { 
      e.preventDefault(); 
        setLoading(true);
        setError("");

        if (enquiry.id == "" || enquiry.id == null) {
            setError("Invalid id. Please close the modal and retry");
            return;
        }
       
        const form = new FormData(e.target); 
        form.set("uid", enquiry.id);
        const payload = Object.fromEntries(form.entries());

        const response = await fetch("/api/invoices/save-customer", {method:"POST", body:JSON.stringify(payload)});
        setLoading(false);
 
        const result = await response.json();
        if (response.ok) { 
          setSuccess("Invoice created and sent successfully.");
          Toast({success:true, duration:9000, msg: "Invoice created and sent successfully."});
          activeModal();
          setTimeout(()=> {
            window.location.href="/dashboard/invoices";
          }, 5000)
          return;
        }

        if (result?.message == "Invalid or expired token. Please login again") {
          window.location.href="/";
          Toast({success:false, msg:"Invalid or expired token. Please login again"})
        }
        setError(result?.message || "An error occurred!");
    }
 
  
    return ( 
        <>
        <div className={ open ? "show vmodal":"remove vmodal" }  > 
            <div className="vmodal-backdrop"></div> 
            <div className="vmodal-dialog">

                <div className="vmodal-header">
                    <h2 className="vmodal-title">Add Customer Details to Send to</h2> 
                    <button className="vmodal-close" onClick={activeModal}>&times;</button>
                </div>

                <div className="vmodal-body">
                    <section > 
                        <form onSubmit={createCustomer}>
                             
                            <div className="form-group mb-3">
                                <label>Customer Name</label>
                                <input required={true} name="name" className="form-control"   />
                            </div>
                            <div className="form-group mb-3">
                                <label>Customer Phone</label>
                                <input required={true} name="phone" className="form-control"   />
                            </div>
                            <div className="form-group mb-3">
                                <label>Customer Email</label>
                                <input required={true} type="email" name="email" className="form-control" />
                            </div>
                            <div className="form-group mb-3">
                                <label>Customer Address</label>
                                <input  type="address" name="address" className="form-control" />
                            </div>
                            
                      <div className="mt-1"> 
                          {error && (
                            <p className="alert alert-sm text-danger">{error}</p>
                          )}
                          {success && (
                            <p className="alert alert-sm text-success">{success}</p>
                          )}
                      </div>
                            
                            <div className="vmodal-footer">
                                <button className="vbtn vbtn-secondary" type="button" data-modal-close onClick={activeModal} >
                                    Cancel
                                </button>
            
                                <button className="vbtn btn-success" type={loading?"button":"submit"} 
                                    >{loading?"Saving...":"Save and Send Invoice"}   </button>
                            </div> 

                        </form>
                    </section>
                </div> 
            </div>
        </div>
        </>
    );
}