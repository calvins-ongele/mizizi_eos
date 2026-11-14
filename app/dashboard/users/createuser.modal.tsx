"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useSWR from "swr";


//marketers
interface editModalProps {
  enquiry: editType;
  onClose: () => void;
  onSave: (data: editType) => void; // Added callback prop
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function CreateUserModal({ enquiry, onClose, onSave }: editModalProps) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");  
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [roles, setRoles] = useState<any[]>([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    status: "active",
    password: "",
    cpassword: ""
  });


  //fetch roles 
    useEffect(() => {
    fetch("/api/users/roles", { method: "GET" })
      .then(res => res.json())
      .then(data => { 
        setRoles(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  function activeModal() {
    onClose();
    setOpen(false);
  }
  

  const { data, mutate, isLoading } = useSWR(
    `/api/content/fetch/admin?cont_id=${enquiry.cont_id}`,
    fetcher
  );

  
  
  function togglePasswordVisibility() {
    if (viewPassword) setViewPassword(false);
    else setViewPassword(true);
  }
    const submitNewUser = async () => {
      if (user.password !== user.cpassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Password and Confirm Password do not match.",
        });
        return;
      }
  
      try {
          const response = await fetch("/api/users/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
          });
          const result = await response.json();
          if (result.success) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "User created successfully.",
            });
            activeModal();
            setUser({
              name: "",
              email: "",
              phone: "",
              role: "",
              status: "1",
              password: "",
              cpassword: ""
            });
            mutate();
          } else { 
  
            let errorMsg = result.message || "Error:";
            for(const detail of result.details || []) {
              let field = detail.field || "Unknown";
              if (field === "cpassword") field = "Confirm Password";

              errorMsg += `\n${field.toUpperCase()}: ${detail.message}`;
            }
            setError(errorMsg);
  
          }
        } catch (e) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while creating the user.",
          });
        }
      }
  
 

  return (
    <div className={open ? "show vmodal" : "remove vmodal"}>
      <div className="vmodal-backdrop"></div>
      <div className="vmodal-dialog">
        <div className="vmodal-header">
          <h2 className="vmodal-title">Create User</h2>
          <button className="vmodal-close" onClick={activeModal}>&times;</button>
        </div>

        <div className="vmodal-body" >
            <form id="newUserForm">
                <div className="row g-4">
                {/* <!-- Personal Information Section --> */}
                <div className="col-12 ">
                    <h6 className="fw-bold">Personal Information</h6>
                </div> 

                {/* <!-- Personal Information Fields --> */}
                <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">Full Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="firstName" placeholder="Enter name"
                    defaultValue={user.name}
                    onChange={(e)=>setUser((prev) => ({ ...prev, name: e.target.value }))}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="PhoneNumber" className="form-label">Phone Number <span className="text-danger">*</span></label>
                    <input type="tel" className="form-control" id="PhoneNumber" placeholder="Enter phone number" 
                    defaultValue={user.phone}
                    onChange={(e)=>setUser((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                </div>

                {/* <!-- Username & Email --> */}
                
                <div className="col-md-12">
                    <label htmlFor="email" className="form-label">Email Address <span className="text-danger" 
                    >*</span></label>
                    <input type="email" className="form-control" id="email" placeholder="name@example.com" 
                    defaultValue={user.email}
                    onChange={(e)=>setUser((prev) => ({ ...prev, email: e.target.value }))}
                    />
                </div>

                {/* <!-- Account Settings Section --> */}
                <div className="col-12 mt-4 mb-2">
                    <h6 className="fw-bold border-bottom pb-2">Account Settings</h6>
                </div>

                {/* <!-- Role & Status with improved options --> */}
                <div className="col-md-6">
                    <label htmlFor="role" className="form-label">User Role <span className="text-danger">*</span></label>
                    <select className="form-select" id="role" 
                    onChange={(e)=>setUser((prev) => ({ ...prev, role: e.target.value }))} >
                    <option value=""  hidden >Select role</option>
                    {roles.map((role:any, i:number)=>(
                        <option key={i} value={role.id}>{role.name}</option>
                    ))} 
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="statusActive" className="form-label">Account Status</label>
                    <select className="form-select" id="statusActive"
                    onChange={(e)=>setUser((prev) => ({ ...prev, status: e.target.value }))}  >
                    <option value=""  hidden >Select status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    
                </div>

                {/* <!-- Password & Confirm Password with strength indicator --> */}
                <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
                    <div className="input-group">
                    <input type={viewPassword ? "text" : "password"} className="form-control" id="password" 
                    defaultValue={user.password}
                    onChange={(e)=>setUser((prev) => ({ ...prev, password: e.target.value }))}/>
                    <button className="btn btn-outline-light" type="button" onClick={togglePasswordVisibility}>
                        <i className={viewPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                    </div>
                    <div className="progress mt-2 small">
                    <div className="progress-bar bg-danger w-0" role="progressbar" id="passwordStrength"></div>
                    </div>
                    
                </div>
                <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></label>
                    <div className="input-group">
                    <input type={viewPassword ? "text" : "password"}  className="form-control" id="confirmPassword" 
                    defaultValue={user.cpassword}
                    onChange={(e)=>setUser((prev) => ({ ...prev, cpassword: e.target.value }))}/>
                    <button className="btn btn-outline-light" type="button" onClick={togglePasswordVisibility}>
                        <i className={viewPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                    </div>
                    <div id="passwordMatch" className="form-text"></div>
                </div>

                {/* <!-- Additional Information Section --> */}
                {/* <div className="col-12 mt-4 mb-2">
                    <h6 className="fw-bold border-bottom pb-2">Additional Information</h6>
                </div> */}

                {/* <!-- Phone & Department with improved input --> */}
                    
                {/* <div className="col-md-6">
                    <label htmlFor="department" className="form-label">Department</label>
                    <select className="form-select" id="department">
                    <option value="" >Select department</option>
                    <option value="it">IT &amp; Development</option>
                    <option value="hr">Human Resources</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                    <option value="operations">Operations</option>
                    <option value="support">Customer Support</option>
                    </select>
                </div> */}

                {/* <!-- Permissions Section --> */}
                    
                {/* <!-- Notification Settings --> */}

                </div> 

               
               
                <div className="mt-1"> 
                    {error && (
                    <p className="alert alert-sm text-danger fs-8" style={{whiteSpace:"pre-line"}}>{error}</p>
                    )}
                    {success && (
                    <p className="alert alert-sm text-success">{success}</p>
                    )}
                </div>

            <div className="vmodal-footer mt-3">
              <button className="vbtn vbtn-secondary" type="button" onClick={activeModal}>
                Cancel
              </button>
              <button className="vbtn btn-success" type="button" form="newUserForm"
                        onClick={()=>submitNewUser()} >
                <i className="bi bi-save me-1"></i> Confirm & Save
              </button>
            </div>
 

          </form>
        </div>
      </div>
    </div>
  );
}