"use client"

import { useState } from "react";

export default function PasswordReset() {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [see, setSee] = useState(false);

    function toggleSee() {
        if (see) setSee(false);
        else setSee(true);
    }

    async function changePass(e:any) {
        e.preventDefault();
        setSuccess("");
        setError(""); 
        
        const form = new FormData(e.target);
        const payload = Object.fromEntries(form.entries());

        const res = await fetch("/api/auth/password-self-change", {
        method: "POST",
        body: JSON.stringify(payload),
        });
        const result = await res.json();

        if (result.success) {
            setSuccess(result?.data?.message ?? "Action successful");
            return;
        }
        setError(result?.message ?? "An error occurred.") 
    }


    return (

        <><form onSubmit={changePass} >
            <div className="row gx-4">
                <div className="col-sm-12">
                <div className="border rounded-2 p-3 mb-3">
                    <div className="mb-4 bg-primary-subtle p-2 rounded-2">
                        So change your password periodically. <strong>Do not
                        share your password.</strong>
                    </div>

                    {/* <!-- Row start --> */}
                    <div className="row gx-4 justify-content-center">
                        
                    <div className="col-sm-4">
                        <div className="mb-3">
                        <label className="form-label" htmlFor="currentPwd">Current password <span
                            className="text-danger">*</span></label>
                        <div className="input-group">
                            <input type={`${see ? 'password':'text'}`} id="currentPwd" placeholder="Enter Current password" name="currentPass"
                            className="form-control" />
                            <button className="btn btn-outline-secondary" type="button"
                            onClick={toggleSee}
                            >
                            <i className={`bi text-black ${see ? 'bi-eye':'bi-eye-slash'} ` }></i>
                            </button>
                        </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="mb-3">
                        <label className="form-label text-primary" htmlFor="newPwd">New password <span
                            className="text-danger">*</span></label>
                        <div className="input-group">
                            <input  type={`${see ? 'password':'text'}`} id="newPwd" className="form-control" name="pass_1"
                            placeholder="Your password must be 8-20 characters long." />
                            <button className="btn btn-outline-secondary" type="button"
                            onClick={toggleSee}>
                            <i className={`bi text-black ${see ? 'bi-eye':'bi-eye-slash'} ` }></i>
                            </button>
                        </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="mb-3">
                        <label className="form-label text-primary" htmlFor="confNewPwd">Confirm new password <span
                            className="text-danger">*</span></label>
                        <div className="input-group">
                            <input  type={`${see ? 'password':'text'}`} id="confNewPwd" name="pass_2" placeholder="Confirm new password"
                            className="form-control"/>
                            <button className="btn btn-outline-secondary" type="button"
                            onClick={toggleSee}>
                            <i className={`bi text-black ${see ? 'bi-eye':'bi-eye-slash'} ` }></i>
                            </button>
                        </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Update Password</button>
                        </div>
                    </div>
                    
                    {error && <p className="alert alert-sm text-danger">{error}</p>}
                    {success && (
                        <p className="alert alert-sm text-success">{success}</p>
                    )}
                    
                    </div>
                    {/* <!-- Row end --> */}

                </div>
                </div>
            </div>
            </form>
        </>
    );
}