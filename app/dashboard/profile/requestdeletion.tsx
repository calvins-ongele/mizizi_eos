"use client"
import Swal from "sweetalert2";

 

export default function RequestDeletion() {
    

    async function deleteAccount() {
 
        
        const result = await Swal.fire({
            title: "Delete Profile?",
            text: `Your account will be deleted? This cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete",
        });

        if (!result.isConfirmed) return;

        const response = await fetch( `/api/auth/requestdeletion`,
                    { method: "DELETE", } );
        const results = await response.json();
        if (results.success) {
            Swal.fire({
                title: "Success",
                text: `${results?.data?.message ?? "Action successfull"}`,
                icon: "success", 
            });
           return;
        }
        Swal.fire({
            title: "Errorr",
            text: `${results?.data?.message ?? "Action unsuccessfull"}`,
            icon: "error", 
        });


    }

    return (

        <>
        <div className="p-4 text-center">
            <h5 className="text-danger mb-3">Delete Account?</h5>
            <p className="mb-0">
                Only Admins can delete account
            </p>
            <div className="mt-3 d-flex justify-content-center gap-2">
                <button type="button" className="btn btn-soft-primary">No Thanks</button>
                <button type="button" className="btn btn-soft-danger" onClick={deleteAccount}>
                <strong>Yes, Request Delete</strong>
                </button>
            </div>
            </div>
        </>
    );
}