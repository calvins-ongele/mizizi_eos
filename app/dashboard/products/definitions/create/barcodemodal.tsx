"use client";

import { useRef, useState } from "react";
import Barcode from "./barcodeview";
import { useReactToPrint } from "react-to-print";
 



export default function BarcodeModal({ barcode,productname, onClose }: BarcodeProps) {
  const [open, setOpen] = useState(true);
  const [copies, setCopies] = useState('5');
    const printRef = useRef(null);
  
      const handlePrint = useReactToPrint({
      contentRef: printRef,
      });

      async function handlePrintBackend(barcode:string, productname:string) {
        try {
          const response = await fetch("/api/pos/print-barcode", {method:"POST", body:JSON.stringify({
            barcode, productname,
            copies
          })})

        } catch(e) { }
        finally {

        }
      }

  function activeModal() {
    onClose();
    setOpen(false);
  }
 

  return (
    <div className={open ? "show vmodal" : "remove vmodal"}>
      <div className="vmodal-backdrop"></div>
      <div className="vmodal-dialog">
        <div className="vmodal-header">
          <h2 className="vmodal-title">Barcode Printout</h2>
          <button className="vmodal-close" onClick={activeModal}>&times;</button>
        </div>

        <div className="vmodal-body">
           <section>
            <div  ref={printRef}>
                <Barcode barcodeVal={barcode} />
                <p className="mx-2">{productname}</p>
            </div>
            <div className="mt-3 d-flex justify-content-between">
                {/* <button className="btn btn-sm btn-success" onClick={handlePrint}>Print from Browser</button> */}
                <div>
                  <label>Copies to print</label>
                  <input value={copies} onChange={(e)=>setCopies(e.target.value)} type="number"className="form-control" />
                </div>
                <button className="btn btn-sm btn-success" onClick={()=>handlePrintBackend(barcode, productname)}>Print barcode </button>
            </div>
           </section>
        </div>
      </div>
    </div>
  );
}