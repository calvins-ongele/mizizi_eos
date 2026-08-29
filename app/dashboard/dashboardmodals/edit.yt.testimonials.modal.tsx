"use client";

import { useState } from "react";
import useSWR from "swr";


//marketers
interface editModalProps {
  enquiry: editType;
  onClose: () => void;
  onSave: (data: editType) => void; // Added callback prop
}

type ItemsType = {
    id: string;
    label: string;
    value: string;
}

export default function ContentEditYTSModal({ enquiry, onClose, onSave }: editModalProps) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [items, setItems] = useState<ItemsType[]> ([]); 

  function activeModal() {
    onClose();
    setOpen(false);
  }
  

const fetcher = (url: string) => fetch(url).then(
    (r) => r.json()
).then((d)=> { 
    return (`${d?.data?.section_text}`.split(','))
}).then((rows) => {
    setItems([]);
    const len = rows.length < 1 ? 1: rows.length;
    
    for (let i = 0; i < len; i++) {
        setItems(prev => [
            ...prev, {
            id: crypto.randomUUID(),
            label: `Testimonial YT Link ${i+1}`, 
            value: rows[i], 
            }
        ]);
    }
     
});

 

function AddNewRow() {
        setItems(prev => [
            ...prev, {
            id: crypto.randomUUID(),
            label: `Testimonial YT Link `, 
            value: "", 
            }
        ]);
}

  const { data, mutate, isLoading } = useSWR(
    `/api/content/fetch/admin?cont_id=${enquiry.cont_id}`,
    fetcher
  );

function removeRow(id:string) { 
    setItems(prev => prev.filter(item => item.id !== id)); 
}
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = items; //new FormData(e.currentTarget);
    
    // Construct 
    const response = await fetch("/api/content/save/yts", {
        method:"POST",
        body: JSON.stringify({
            form,
            type:'links',
            cont_id: enquiry?.cont_id
        })
    });
    const result = await response.json();
    if (result.success) {
        activeModal();
        setSuccess(result.message??"Changes saved");
        return;
    }

    setError(result.message??"An error occurred");
 
    
  }
 

  return (
    <div className={open ? "show vmodal" : "remove vmodal"}>
      <div className="vmodal-backdrop"></div>
      <div className="vmodal-dialog">
        <div className="vmodal-header">
          <h2 className="vmodal-title">Modify Section Data</h2>
          <button className="vmodal-close" onClick={activeModal}>&times;</button>
        </div>

        <div className="vmodal-body" >
          <form onSubmit={handleSubmit} >
            <input type="hidden" name="cont_id" value={enquiry.cont_id} readOnly={true} />
            <div className="form-group mb-3">
              

              {items.map((item) => (
                <section className="mb-3">
                    <label className="mb-1">{item?.label}
                        <button onClick={()=>removeRow(item.id)} type="button" className="btn btn-outline-dangerc btn-icon" title="Delete row">
                                        <i className="bi bi-trash"></i>
                                      </button> 
                    </label>
                    <input required={true} name="content[]" className="form-control" 
                    onChange={(e)=> 
                                setItems(prev => 
                                    prev.map(
                                        row => row.id === item.id ? {...row, value: (e.target.value) }: row
                                    )
                                )
                            }
                    defaultValue={item?.value ?? ""} 
                    placeholder="youtube link eg https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
                </section>

              ))}

         
            
            </div> 
            <section className="d-flex justify-content-end">
                <button  onClick={()=>AddNewRow()} type="button" className="btn btn-secondary">add link</button>
            </section>

            <div className="vmodal-footer">
              <button className="vbtn vbtn-secondary" type="button" onClick={activeModal}>
                Cancel
              </button>
              <button className="vbtn btn-success" type="submit">
                Confirm & Save
              </button>
            </div>

            
        
            <div className="mt-1"> 
                {error && (
                <p className="alert alert-sm text-danger">{error}</p>
                )}
                {success && (
                <p className="alert alert-sm text-success">{success}</p>
                )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}