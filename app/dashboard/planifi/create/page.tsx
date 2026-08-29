"use client"; 
import {  useState } from "react";
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients";
import { useSearchParams } from 'next/navigation';
import Loading from "@/app/components/Loading";

export default function CreateInvoicePage() {

    const [items, setItems] = useState([{
        id: crypto.randomUUID(),
        product: "",
        quantity: 1,
        unit: "",
        price: 0, 
        vat: 0,

    }]); 
    const [discount, setDiscount] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [totalVat, setTotalVat] = useState(0);
    const [total, setTotal] = useState(0);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    async function AddNewRow() {
        setItems(prev => [
            ...prev, {
            id: crypto.randomUUID(),
            product: "",
            quantity: 1,
            unit: "",
            price: 0, 
            vat: 0,
            }
        ]);
        calculateSummaryTotals();
 
    }

    function removeRow(id:string) { 
        setItems(prev => prev.filter(item => item.id !== id));
        calculateSummaryTotals();
    }

    function calculateSummaryTotals() {
            let subtotal = 0;
            let totalVat = 0;
            for(const item of items) {
                const itemTotal = item.quantity * item.price;
                subtotal += itemTotal;
                totalVat += (item.vat / 100) * itemTotal;
            }
            setSubtotal(subtotal);
            setTotalVat(totalVat);
            setTotal(subtotal - discount + totalVat);
        }

        function setDiscountPc(discountPc:string) {
            if (!Number(discountPc)) {
                setDiscount(0);
                return;
            }
            setDiscount((Number(discountPc) / 100) * subtotal);
            setTotal(subtotal - (Number(discountPc) / 100) * subtotal + totalVat);
        }

    async function saveDraft(preview = false) {
        // Save the invoice data to the server or local storage
        // If preview is true, open a new window with the invoice preview
        console.log("Saving draft...", {items, subtotal, discount, totalVat, total});
        
        const form = prepareInvoiceData("draft");

        // invoice number is required or generate
        //due date is required
        if (items.length === 0) {
            setError("Please add at least one item to the invoice.");
            return;
        }
        if (!dueDate) {
            setError("Please select a due date.");
            return;
        }

        const response  = await fetch("/api/invoices/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const result = await response.json();

        if (!response.ok) {
            setError(result.error || "An error occurred while saving the invoice.");
        }

        if (preview) {
            window.open(`/invoices/preview/${result.id}`, "_blank");
        }

    }
    async function sendInvoice() {
        // Send the invoice to the server and trigger email sending
        const form = prepareInvoiceData("sent");

        // invoice number is required or generate
        //due date is required
        if (items.length === 0) {
            setError("Please add at least one item to the invoice.");
            return;
        }
        if (!dueDate) {
            setError("Please select a due date.");
            return;
        }

        
    }
    function prepareInvoiceData(status = "draft") {
        const invoiceData = {
            items,
            subtotal,
            discount,
            totalVat,
            total,
            invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
            dueDate,
            message, status
        };
        console.log("Preparing invoice data...", invoiceData);
    }



    return (
        <div className="container-fluid px-3 pt-2">
            <div className="row gx-4">
              <div className="col-xxl-9 col-sm-12">

                <div className="card mb-4">
                  <div className="card-body">
                    <div className="rounded-2 mb-4">

                      {/* <!-- Row start --> */}
                      <div className="row gx-4">
                        <div className="col-sm-6 col-12">
                          <div className="mb-3">
                            <img src="assets/images/logo-dark.svg" className="invoice-logo" alt="" />
                          </div>
                          <p className="m-0">Maximo Vasquez,<br/> Suite 668 1642 Wintheiser Ways,<br/> Port Paola,<br/> CO 69990-9851</p>
                        </div>
                        <div className="col-sm-6 col-12">
                          {/* <!-- Row start --> */}
                          <div className="row">
                            <div className="col-sm-12 col-12">
                              {/* <!-- Form group start --> */}
                              <div className="mb-2">
                                <label className="form-label">Invoice Number</label>
                                <input type="text" className="form-control" placeholder="Enter Invoice Number" 
                                onChange={(e) => setInvoiceNumber(e.target.value)} />
                              </div>
                              {/* <!-- Form group end --> */}
                            </div>
                           
                            <div className="col-sm-12 col-12">
                              {/* <!-- Form group start --> */}
                              <div className="mb-2">
                                <label htmlFor="dueDate" className="form-label">Due Date</label>
                                <div className="input-group">
                                  <input type="date" className="form-control datepicker-opens-left" id="dueDate" placeholder="DD/MM/YYYY"
                                  onChange={(e) => setDueDate(e.target.value)} />
                                 
                                </div>
                              </div>
                              {/* <!-- Form group end --> */}
                            </div>
                            <div className="col-sm-12 col-12">
                              {/* <!-- Form group start --> */}
                              <div>
                                <label htmlFor="msgCustomer" className="form-label">Message</label>
                                <textarea rows={2} id="msgCustomer" className="form-control"
                                onChange={(e) => setMessage(e.target.value)}></textarea>
                              </div>
                              {/* <!-- Form group end --> */}
                            </div>
                            <div className="col-sm-12 col-12">{error && <div className="alert alert-sm text-danger">{error}</div>}</div>
                          </div>
                          {/* <!-- Row end --> */}
                        </div>
                      </div>
                      {/* <!-- Row end --> */}

                    </div>

                    {/* <!-- Row start --> */}
                    <div className="row gx-4">
                      <div className="col-12">
                        <div className="table-outer mb-2 bg-white">
                          <div className="table-responsive">
                            <table className="table align-middle">
                              <thead>
                                <tr>
                                  <th>Product</th> 
                                  <th style={{width:"120px"}}>Quantity</th>
                                  <th style={{width:"120px"}}>Unit</th>
                                  <th style={{width:"120px"}}>Price</th>
                                  <th style={{width:"120px"}}>VAT</th> 
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((item) => (
                                  <tr key={item.id}>
                                    <td>
                                        {/* {id, product, quantity, unit, price, amount, vat} */}
                                      <input className="form-control" id={`fc11-${item.id}`} aria-label="Select Product"
                                        onChange={(e)=> 
                                            setItems(prev => 
                                                prev.map(
                                                    row => row.id === item.id ? {...row, product: (e.target.value) }: row
                                                )
                                            )
                                        }
                                      /> 
                                    </td>
                                  <td>
                                    {/* <!-- Form group start --> */}
                                    <div className="m-0">
                                      <input type="number" className="form-control" placeholder="Qty"
                                        onChange={(e)=> 
                                            setItems(prev => 
                                                prev.map(
                                                    row => row.id === item.id ? {...row, quantity: Number(e.target.value) }: row
                                                )
                                            )
                                        } />
                                    </div>
                                    {/* <!-- Form group end --> */}
                                  </td>
                                  <td>
                                    {/* <!-- Form group start --> */}
                                    <div className="m-0">
                                      <input type="text" className="form-control" placeholder="Unit" aria-label="Unit" 
                                      
                                        onChange={(e)=> 
                                            setItems(prev => 
                                                prev.map(
                                                    row => row.id === item.id ? {...row, unit: (e.target.value) }: row
                                                )
                                            )
                                        }/>
                                    </div>
                                    {/* <!-- Form group end --> */}
                                  </td>
                                  <td>
                                    {/* <!-- Form group start --> */}
                                    <div className="input-group m-0">
                                      <input type="text" className="form-control" placeholder="Price" aria-label="Price" 
                                        onChange={(e)=> 
                                            setItems(prev => 
                                                prev.map(
                                                    row => row.id === item.id ? {...row, price: Number(e.target.value) }: row
                                                )
                                            )
                                        }/>
                                      <span className="input-group-text">
                                        <i className="bi bi-currency-dollar"></i>
                                      </span>
                                    </div>
                                    {/* <!-- Form group end --> */}
                                  </td>
                                  <td>
                                    {/* <!-- Form group start --> */}
                                    <div className="input-group m-0">
                                      <input type="text" className="form-control" placeholder="VAT %" aria-label="VAT Percentage" 
                                        onChange={(e)=> 
                                            setItems(prev => 
                                                prev.map(
                                                    row => row.id === item.id ? {...row, vat: Number(e.target.value) }: row
                                                )
                                            )
                                        }/>
                                      <span className="input-group-text">
                                        <i className="bi bi-percent"></i>
                                      </span>
                                    </div>
                                    {/* <!-- Form group end --> */}
                                  </td> 
                                  <td>
                                    <div className="d-inline-flex gap-2">
                                      <button onClick={()=>removeRow(item.id)} type="button" className="btn btn-outline-danger btn-icon" title="Delete row">
                                        <i className="bi bi-trash"></i>
                                      </button> 
                                    </div>
                                  </td>
                                </tr>
                                ))}
                                <tr>
                                  <td>
                                     
                                    <button type="button" className="btn btn-primary" onClick={AddNewRow}>
                                      Add New Row
                                    </button>
                                  </td>
                                  <td colSpan={6}>
                                    <div className="d-flex gap-2">
                                      <div className="ms-auto">
                                        <label className="col-form-label" htmlFor="fc10">Discount % of Total Amount</label>
                                      </div>
                                      <div className="col-auto">
                                        <input type="text" id="fc10" className="form-control" placeholder="0%" 
                                          onChange={(e) => setDiscountPc(e.target.value) }/>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={5}>&nbsp;</td>
                                  <td colSpan={2} className="text-end">
                                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                                    <p>Discount: ${discount.toFixed(2)}</p>
                                    <p>VAT: ${totalVat.toFixed(2)}</p>
                                    <h5 className="mt-2 text-danger">Total USD: ${total.toFixed(2)}</h5>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-end gap-1">
                          <button type="button" className="btn btn-outline-primary" onClick={()=>saveDraft() } >
                            Save as Draft
                          </button> 
                          <button type="button" className="btn btn-outline-primary"onClick={()=>saveDraft(true) }>
                            Preview
                          </button>
                          <a href="invoice-list.html" className="btn btn-primary" onClick={()=>sendInvoice() }>Send Invoice</a>
                        </div>
                      </div>
                    </div>
                    {/* <!-- Row end --> */}
                  </div>
                </div>

              </div>
           
            </div>


            
            <JqueryMin />
            <BootstrapBundle />
            <MomentMin />
            <OverlayScrollbarsInit /> 
            <CustomMin />
        </div>
    );
}