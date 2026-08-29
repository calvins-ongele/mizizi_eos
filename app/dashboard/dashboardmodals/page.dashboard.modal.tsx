"use client";

import { useState } from "react";

// Define your Customer type
export type Customer = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
};

interface InvoiceModalProps {
  enquiry: InvoiceModalType;
  onClose: () => void;
  onSave: (data: Customer) => void; // Added callback prop
}

export default function CustomerModal({ enquiry, onClose, onSave }: InvoiceModalProps) {
  const [open, setOpen] = useState(true);

  function activeModal() {
    onClose();
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    
    // Construct the Customer object from form values
    const customerData: Customer = {
      customerName: form.get("name") as string,
      customerPhone: form.get("phone") as string,
      customerEmail: form.get("email") as string,
      customerAddress: form.get("address") as string,
    };

    // Return data back to the parent component
    onSave(customerData); 
    
    // Close the modal
    activeModal();
  }

  return (
    <div className={open ? "show vmodal" : "remove vmodal"}>
      <div className="vmodal-backdrop"></div>
      <div className="vmodal-dialog">
        <div className="vmodal-header">
          <h2 className="vmodal-title">Add Customer Details</h2>
          <button className="vmodal-close" onClick={activeModal}>&times;</button>
        </div>

        <div className="vmodal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Customer Name</label>
              <input placeholder="Optional" name="name" className="form-control" />
            </div>
            <div className="form-group mb-3">
              <label>Customer Phone</label>
              <input placeholder="Optional" name="phone" className="form-control" />
            </div>
            <div className="form-group mb-3">
              <label>Customer Email</label>
              <input placeholder="Optional" type="email" name="email" className="form-control" />
            </div>
            <div className="form-group mb-3">
              <label>Customer Address</label>
              <input placeholder="Optional" type="text" name="address" className="form-control" />
            </div>

            <div className="vmodal-footer">
              <button className="vbtn vbtn-secondary" type="button" onClick={activeModal}>
                Cancel
              </button>
              <button className="vbtn btn-success" type="submit">
                Confirm & Pause Sale
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}