"use client";

import { useState } from "react";

 
interface InvoiceModalProps {
  enquiry: string;
  onClose: () => void; 
}

export default function ReceiptModal({ enquiry, onClose }: InvoiceModalProps) {
  const [open, setOpen] = useState(true);

  function activeModal() {
    onClose();
    setOpen(false);
  }
 
  return (
    <div className={open ? "show vmodal" : "remove vmodal"}>
      <div className="vmodal-backdrop"></div>
      <div className="vmodal-dialog">
        <div className="vmodal-header">
          <h2 className="vmodal-title">Print Receipt</h2>
          <button className="vmodal-close" onClick={activeModal}>&times;</button>
        </div>

        <div className="vmodal-body">

             <div style={{ width: '100%', height: '800px' }}>
                    {enquiry ? (
                        <iframe
                        src={enquiry}
                        width="100%"
                        height="100%"
                        title="Receipt PDF"
                        style={{ border: 'none' }}
                        />
                    ) : (
                        <p>Failed to load PDF.</p>
                    )}
                    </div>
          
        </div>
      </div>
    </div>
  );
}