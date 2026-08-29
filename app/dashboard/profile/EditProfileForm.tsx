"use client";

import { useState } from "react";

type User = {
      id: number,
      name: string,
      email: string,
      role: string,  
      dp: string,
      phone?: string
}

export function EditProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [feedback, setFeedback] = useState([]);

  async function handleSubmit(e: any) {
    //e.preventDefault();
    setStatus("saving"); 

    const res = await fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify({ name, email, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data?.message || "Update failed");
      setFeedback(data?.details);
      return;
    }


    setStatus("saved");
    //window.location.reload();
  }

  return (
    <>
    {/* {
    "success": false,
    "message": "Invalid request data",
    "code": "VALIDATION_ERROR",
    "details": [
        {
            "field": "phone",
            "message": "Minimum length: expected string to have >=10 characters",
            "code": "too_small"
        }
    ]
} */}
    <form onSubmit={handleSubmit} className="space-y-3">
      {status && <p className="text-sm text-gray-600 text-warning">{status}</p>}
      { 
        feedback.map((detail:any)=> {
          return <p className="text-sm text-danger">{detail?.field.toUpperCase()}: {detail?.message??''}</p>
        })
      }

        
    <div className="row gx-4">
        <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="displayName" className="form-label">Display Name</label>
            <input type="text" className="form-control" id="displayName"
              value={user.name} readOnly={true} placeholder="Enter Display Name"/>
          </div>
          <div className="mb-3">
            <label htmlFor="yourEmail" className="form-label">Email</label>
            <input  defaultValue={user.email} onChange={e => setEmail(e.target.value)} name='email' type="email" className="form-control" id="yourEmail"
              placeholder="Enter Email"/>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input defaultValue={user.name}  onChange={e => setName(e.target.value)} name='name' type="text" className="form-control" id="fullName"
              placeholder="Enter Full Name"/>
          </div>
          <div className="mb-3">
            <label htmlFor="yourPhone" className="form-label">Phone Number</label>
            <input type="text" name='phone' className="form-control" id="yourPhone"
            defaultValue={user.phone}  onChange={e => setPhone(e.target.value)}
              placeholder="Enter Phone Number"/>
          </div>
        </div>
        <div className="col-12">
          <div className="d-flex justify-content-end gap-1">
            {/* <button className="btn btn-danger" type="button">Reset</button> */}
            <button className="btn btn-primary" type="button" 
            onClick={handleSubmit}
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

 </form>
    </>
  );
}
