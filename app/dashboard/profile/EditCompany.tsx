"use client";

import Loading from "@/app/components/Loading";
import { useEffect, useState } from "react";
import useSWR from "swr";


type User = {
      id: number,
      name: string,
      email: string,
      role: string,  
      dp: string,
      phone?: string
}

/*
{
  id: 1,
  uuid: '2e682df5-2de9-445e-937d-34f8db3260fb',
  customer_name: 'John Brooks',
  phone: '0712345678',
  email: 'info@miziziclassifieds.com',
  institution_name: 'Mizizi Trial',
  address: 'Marjo Complex',
  website: 'www.miziziclassifieds.com',
  created_at: 2026-07-02T10:15:56.000Z,
  capacity_allowed: 30,
  status: null,
  license_key: 's',
  license_type: 'paid',
  license_id: 1,
  license_expiry: 2026-07-02T09:14:41.000Z,
  pin: 'PIN001234'
} */
export function EditCompany({ user }: { user: User }) {
  const [form, setForm] = useState({ 
    uuid: '',
    customer_name: '',
    phone: '',
    email: '',
    institution_name: '',
    address: '',
    website: '',
    created_at: '',
    capacity_allowed: '',
    status: '',
    license_key: '',
    license_type: '',
    license_id: '',
    license_expiry: '',
    pin: ''
    
  });  
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [feedback, setFeedback] = useState([]);
  const [readonlyContact, setReadonlyContact] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);


const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selectedFile = e.target.files?.[0];
       
        if (!selectedFile) {
          setError('Please select a file first.');
          return;
        }
        
        setUploading(true);
        setError('');

        const form = new FormData();
        form.set('type', 'file');
        form.set('file', selectedFile); 
        
        // Construct 
        try {
            const response = await fetch("/api/company/change-logo", {
                method:"POST",
                body: form
            });
            const result = await response.json();
            if (result.success) {
                setSuccess(result.data.message??"Changes saved");
                mutate(); 
                return;
            }

            setError(result.message??"An error occurred");
        } catch(e) {
            setError('An error occurred during upload.');
        }
        finally {
            setUploading(false);
        }

  };


  const { data, mutate, isLoading } = useSWR('/api/company/org', fetcher);

  useEffect(() => {
    if (data?.data) {
      setForm(data.data);
      const role = `${user.role.toLowerCase()}`;
      if (role =='admin' || role =='superadmin') {
          setReadonlyContact(false);
      }
    }
  }, [data]);
   

  if (isLoading) return <Loading />;
  //setForm(data.data);

  async function handleSubmit(e: any) {
    //e.preventDefault();
    setStatus("saving"); 
    setSuccess("");
    setFeedback([]);

    const res = await fetch("/api/company/org/update", {
      method: "PUT",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data?.message || "Update failed");
      setFeedback(data?.details);
      return;
    } 
    setStatus("saved");
    setSuccess(data.data);
    //window.location.reload();
  }

  return (
    <>
 
    <section className="space-y-3">
      {status && <p className="text-sm text-gray-600 text-warning">{status}</p>}
      { 
        feedback.map((detail:any)=> {
          return <p className="text-sm text-danger">{detail?.field.toUpperCase()}: {detail?.message??''}</p>
        })
      }

        
    <div className="row gx-4">
        <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="displayName" className="form-label">Contact Name</label>
            <input type="text" className="form-control" id="displayName"
            defaultValue={form.customer_name}
            onChange={(e)=>setForm((prev) => ({ ...prev, customer_name: e.target.value }))}
               readOnly={readonlyContact} placeholder="Enter Display Name"/>
          </div>
           </div>
          <div className="col-sm-6"> 
          <div className="mb-3">
            <label  className="form-label">Contact Phone</label>
            <input type="text" className="form-control"  
            defaultValue={form.phone}
            onChange={(e)=>setForm((prev) => ({ ...prev, phone: e.target.value }))}
               readOnly={readonlyContact} placeholder="Contact Phone"/>
          </div>
           </div>
          <div className="col-sm-6"> 
          <div className="mb-3">
            <label htmlFor="yourEmail" className="form-label">Contact Email</label>
            <input   type="email" className="form-control" id="yourEmail"
            defaultValue={form.email} readOnly={readonlyContact}
            onChange={(e)=>setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Enter Email"/>
          </div>
           
        </div>

        <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Organization Name</label>
            <input   type="text" className="form-control" id="fullName"
            defaultValue={form.institution_name} readOnly={readonlyContact}
            onChange={(e)=>setForm((prev) => ({ ...prev, institution_name: e.target.value }))}
              placeholder="Enter Org's Name"/>
          </div>
           </div>
        <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="youraddress" className="form-label">Organization Address</label>
            <input type="text"  className="form-control" id="youraddress"
            defaultValue={form.address} readOnly={readonlyContact}
            onChange={(e)=>setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Enter Address"/>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="website" className="form-label">Organization website</label>
            <input type="text"  className="form-control" id="website"
            defaultValue={form.website} readOnly={readonlyContact}
            onChange={(e)=>setForm((prev) => ({ ...prev, website: e.target.value }))}
              placeholder="Enter Website"/>
          </div>
         </div>
         <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="pin" className="form-label">Organization pin</label>
            <input type="text"  className="form-control" id="pin"
            defaultValue={form.pin} readOnly={readonlyContact}
            onChange={(e)=>setForm((prev) => ({ ...prev, pin: e.target.value }))}
              placeholder="Enter Pin"/>
          </div>
         </div>
         <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="license_type" className="form-label">Organization license type</label>
            <input type="text" readOnly={true}  className="form-control" id="license_type"
            defaultValue={form.license_type}  
              placeholder="Enter license_type"/>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="license_expiry" className="form-label">Organization license expiry</label>
            <input type="text" readOnly={true}  className="form-control" id="license_expiry"
            defaultValue={form.license_expiry?.split('T')[0]}  
              placeholder="Enter license_expiry"/>
          </div>
         </div>
         
        <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="logo" className="form-label">Organization Logo</label>
            <input type="file"  className="form-control" id="logo" onChange={handleFileChange}   />
          </div>
         </div>
       
        <div className="col-12">
          <div className="d-flex justify-content-end gap-1">
            {/* <button className="btn btn-danger" type="button">Reset</button> */}
            <button className="btn btn-primary" type="button" 
            onClick={handleSubmit} disabled={status==='saving'}
            >
              { (status && status==='saving') && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> }
              
              <span role="status">
                { (status && status==='saving') ? 'Saving...' : 'Save' }
              </span>
            </button>
            
          </div>
        </div>
        
      {error && <p className="alert alert-sm text-danger">{error}</p>}
      {success && (
        <p className="alert alert-sm text-success">{success}</p>
      )}
      </div>

 </section>
    </>
  );
}


