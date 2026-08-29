"use client"

import { Toast } from "@/app/components/Toast";
import { useState } from "react";
import CreatableSelect from 'react-select/creatable';
type TitleTasks = {
  label: string;
  value: string;
};

export default function CreatePlanModal({enquiry,onClose}: {
  enquiry: CreateSchedule;
  onClose: () => void;
}) {
    const [open, setOpen] = useState(true); 
    const [title, setTitle] = useState<TitleTasks|null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function activeModal() {
        onClose();
        setOpen(false);
    }
     const options = [
        { value: 'Meeting', label: 'Meeting' },
        { value: 'Interview', label: 'Interview' },
        { value: 'Meeting', label: 'Meeting' },
        { value: 'Task', label: 'Task' },
        { value: 'Stock', label: 'Stock' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Customer', label: 'Customer' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Reminder', label: 'Reminder' },
        { value: 'Delivery', label: 'Delivery' },
        { value: 'Audit', label: 'Audit' },
        { value: 'Therapy Session', label: 'Therapy Session' } 
    ];
 
    async function saveSchedule(e:any) { 
      e.preventDefault(); 

        setLoading(true);
        setError("");
        if (!title) {
            setError("Title is required");
            setLoading(false);
            return;
        }
        const form = new FormData(e.target);
        form.set("title", title?.value ?? "");
        const payload = Object.fromEntries(form.entries());

        const response = await fetch("/api/schedule/create", {method:"POST", body:JSON.stringify(payload)});
        setLoading(false);
 
        const result = await response.json();
        if (response.ok) { 
          setSuccess("Schedule created successfully.");
          Toast({success:true, duration:9000, msg: "Schedule created successfully."});
          activeModal();
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
                    <h2 className="vmodal-title">Save Schedule</h2> 
                    <button className="vmodal-close" onClick={activeModal}>&times;</button>
                </div>

                <div className="vmodal-body">
                    <section > 
                        <form onSubmit={saveSchedule}>
                            <div className="form-group mb-3">
                                <label>Title</label>
                                <CreatableSelect
                                    isClearable
                                    options={options}
                                    value={title}
                                    onChange={setTitle}
                                    placeholder="Select or type a title"
                                /> 
                            </div> 
                            <div className="form-group mb-3">
                                <label>Starting Time</label>
                                <input required={true} name="start_time" className="form-control" defaultValue={enquiry.date_start} />
                            </div>
                            <div className="form-group mb-3">
                                <label>End Time</label>
                                <input required={true} name="end_time" className="form-control" defaultValue={enquiry.date_end} />
                            </div>
                            <div className="form-group mb-3">
                                <label>Notes</label>
                                <textarea name="notes" className="form-control" />
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
                                    >{loading?"Saving...":"Save"} </button>
                            </div> 

                        </form>
                    </section>
                </div> 
            </div>
        </div>
        </>
    );
}