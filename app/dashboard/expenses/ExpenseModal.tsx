"use client"

import { Toast } from "@/app/components/Toast";
import { allowed } from "@/engine/modules/expenses/expenses.allowed";
import { useState } from "react"; 



export default function ExpenseModal({onClose}: { 
  onClose: () => void;
}) {
    const [open, setOpen] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const alloweds = allowed();

    function activeModal() {
        onClose();
        setOpen(false);
    }
     
    async function createExpense(e:any) { 
      e.preventDefault(); 
        setLoading(true);
        setError(""); 
       
        const form = new FormData(e.target);  
        const payload = Object.fromEntries(form.entries());

        const response = await fetch("/api/expenses/create-expense", {method:"POST", body:JSON.stringify(payload)});
        setLoading(false);
 
        const result = await response.json();
        if (response.ok) { 
          setSuccess("Invoice created and sent successfully.");
          Toast({success:true, duration:9000, msg: "Expense created and sent successfully."});
          activeModal();
          setTimeout(()=> {
            window.location.href="/dashboard/expenses";
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
                    <h2 className="vmodal-title">Add an expense</h2> 
                    <button className="vmodal-close" onClick={activeModal}>&times;</button>
                </div>

                <div className="vmodal-body">
                    <section > 
                        <form onSubmit={createExpense}>
                             
                            <div className="form-group mb-3">
                                <label>Expense category</label>
                                <select required={true} name="category" className="form-control"  >
                                    <option hidden>Select expense category</option>
                                    {
                                        alloweds.map((row:string)=>{
                                            return <option value={row}>{row}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label>Amount</label>
                                <input required={true} type="text" name="amount" className="form-control" />
                            </div>
                            <div className="form-group mb-3">
                                <label>Expense Status</label>
                                <select name="status" className="form-control" >
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label>Description</label>
                                <textarea required={true} name="description" className="form-control"   />
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
                                    >{loading?"Saving...":"Save Expense"}   </button>
                            </div> 

                        </form>
                    </section>
                </div> 
            </div>
        </div>
        </>
    );
}