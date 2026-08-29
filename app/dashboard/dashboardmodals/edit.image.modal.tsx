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
export default function ImageEditModal({ enquiry, onClose, onSave }: editModalProps) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  function activeModal() {
    onClose();
    setOpen(false);
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  

  const { data, mutate, isLoading } = useSWR(
    `/api/content/fetch/admin?cont_id=${enquiry.cont_id}`,
    fetcher
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    
    setUploading(true);
    setError('');

    const form = new FormData();// FormData(e.currentTarget);
    form.set('type', 'file');
    form.set('file', file);
    form.set('cont_id', enquiry.cont_id);
    
    // Construct 
    try {
        const response = await fetch("/api/content/save-file", {
            method:"POST",
            body: form
        });
        const result = await response.json();
        if (result.success) {
            activeModal();
            setSuccess(result.data.message??"Changes saved");
            return;
        }

        setError(result.message??"An error occurred");
    } catch(e) {
        setError('An error occurred during upload.');
    }
    finally {
        setUploading(false);
    }
 
    
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
              <label>Change Section Image</label>
              <input required={true} type="file" name="file" 
              onChange={handleFileChange} 
              className="form-control" 
              accept="image/*"
              />
            </div> 

            <div className="vmodal-footer">
              <button className="vbtn vbtn-secondary" type="button" onClick={activeModal}>
                Cancel
              </button>
              <button 
              disabled={uploading || !file}
              className="vbtn btn-success" type="submit">
                
                {uploading ? 'Uploading...' : 'Confirm & Save'}
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