"use client";

import { useState } from "react";
import useSWR from "swr";


//marketers
interface editModalProps {
  enquiry: editType;
  onClose: () => void;
  onSave: (data: editType) => void; // Added callback prop
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function ContentEditModal({ enquiry, onClose, onSave }: editModalProps) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isYoutube, setIsYoutube] = useState(false);

  function activeModal() {
    onClose();
    setOpen(false);
  }
  

  const { data, mutate, isLoading } = useSWR(
    `/api/content/fetch/admin?cont_id=${enquiry.cont_id}`,
    fetcher
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    
    // Construct 
    const response = await fetch("/api/content/save", {
        method:"POST",
        body: JSON.stringify({
            content: form.get('content'),
            cont_id: form.get('cont_id'),
            type: 'text'
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
              <label>Section Content</label>
              {enquiry.cont_id == 'first_yt_link' && (
                  <input required={true} name="content" className="form-control" 
                    defaultValue={data?.data?.section_text ?? ""} 
                    placeholder="youtube link eg https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
              )}
            {enquiry.cont_id != 'first_yt_link' && (
              <textarea required={true} name="content" className="form-control" 
             defaultValue={data?.data?.section_text ?? ""} />
             )}
            </div> 

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