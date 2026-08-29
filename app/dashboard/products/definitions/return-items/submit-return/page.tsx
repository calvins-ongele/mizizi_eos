"use client"; 
import { useEffect, useRef, useState } from "react";
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients"; 
import Loading from "@/app/components/Loading";
import useSWR from "swr";
import Swal from "sweetalert2";
  
type ProductDB = {
  barcode: string;
  product_name: string;
  price_per_unit: string; // DB string //selling price
  quantity_available: string; // DB string
  cost_price: string;
  product_definition_id: string;
};
type CartItem = {
  barcode: string;
  product_name: string;
  price: number; // number
  available: number; // number
  qty: number; // UI-only
  supplier_id: string | number;
  product_definition_id: string;
};


const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function SubmitReturnsPage() {   
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 
    
  const [barcode, setBarcode] = useState("");
  const [suggestions, setSuggestions] = useState<ProductDB[]>([]); 
  const [showSuggestions, setShowSuggestions] = useState(false); 

    
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
 
 

  const [form, setForm] = useState({
    name: "", 
    barcode: "", 
    cost_price: "",
    selling_price: "", 
    quantity: 0,
    productid: "",
    supplier_id: 0,
    productQuantity:0,
    description:"",
    reason_id:''
  });
 

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { 
    setForm((prev) => ({ ...prev, [key]: value }));
  } 

  function resetForm() {
     setForm({
        name: "", 
        barcode: "",  
        cost_price: "",
        selling_price: "", 
        productQuantity: 0,
        productid: '',
        supplier_id:0,
        quantity:0,
        description:"",
        reason_id:''
      });
      setBarcode("");
      inputRef.current?.focus();
  } 

  async function handleSubmit() { 
    setError(null);
    setSuccess(null);
    if (!form.reason_id) {
      setError("Please select a return reason");
      return;
    }
    if (!form.productid) {
      setError("Please select a product");
      return;
    }
    if (form.quantity <= 0) {
      setError("Quantity must be greater than zero");
      return;
    } 
    setSaving(true);

    const swalResult = await Swal.fire({
      title: "Confirm Return",
      text: `Are you sure you want to return ${form.quantity} of ${form.name}?`,    
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, return it!",
      });

    if (!swalResult.isConfirmed) {
      setSaving(false);
      return;
    }
      

    try {
      const res = await fetch("/api/products/return-items/create", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const response = await res.json();

      if (!res.ok) {
        setError(response.message || "An error occurred while submitting the return.");
        return;
      }
      setSuccess("Return submitted successfully.");
      resetForm();

    } catch (err) {
      setError("An error occurred while submitting the return.");
    } finally {
      setSaving(false);
      
    }

  }
  
    const { data, mutate, isLoading } = useSWR(
        "/api/products/return-reasons",
        fetcher
    );

  async function searchProducts(q: string) {

    if (!q.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    //at least 3chars
    if (q.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ search: q, greater:1 }),
    });

    const data = await res.json();

    const products: ProductDB[] = data.data || [];

    //  Auto-add if exactly one result
    if (products.length === 1) { 
      update("productid", products[0].product_definition_id || "0" );
      populateFields(products[0]);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestions(products);
    setShowSuggestions(products.length > 0);
  }
  
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    if (suggestions.length === 1) {
      populateFields(suggestions[0]);
    } else if (suggestions.length > 1) {
      setShowSuggestions(true);
    } else {
      // no result ... error sound
    }
  }

  function populateFields(product: ProductDB) {
    setBarcode(product.barcode);
    update("name", product.product_name); 
    update("selling_price", product.price_per_unit);
   // update("quantity", Number(product.quantity_available || 0) );
    update("cost_price", product.cost_price);
    setShowSuggestions(false);
  }
 
    

 
    if (isLoading) return Loading({height:200});
    const alloweds = data?.data || [];
  return (
    <div className="container px-3 pt-3 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Return an item</h5>

              <form onSubmit={handleSubmit}>
                <div className="row">

                    
                <div className="col-md-12  mb-3">
                    <label>Return Reason</label>
                    <select required={true} name="reason_id" className="form-control" 
                    onChange={
                        (e) => update("reason_id", e.target.value)
                    }
                     >
                        <option hidden>Select return reason</option>
                        {
                            alloweds.map((row:any)=>{
                                return <option value={row.id}>{row.name}</option>
                            })
                        }
                    </select>
                </div>

                <div className="col-md-12 position-relative mb-3"> 
                  <label className="form-label">Search Product</label>
                <input
                className="form-control"
                ref={inputRef}
                value={barcode}
                autoFocus
                placeholder="Scan or type..."
                onChange={(e) => {
                    setBarcode(e.target.value); 
                    searchProducts(e.target.value);
                    setForm((prev) => ({ ...prev, barcode: e.target.value }));
                }}
                onKeyDown={handleKeyDown}
                />
                
                    {showSuggestions && suggestions.length > 1 && (
                    <div className="pos-suggestions">
                        {suggestions.map((p) => (
                        <div
                            key={p.barcode}
                            className="suggestion-item"
                            onClick={() => {
                                populateFields(p);
                                setBarcode(p.barcode);
                                setShowSuggestions(false);
                                update("productid", p.product_definition_id || "0" );
                            }}
                        >
                            <strong>{p.product_name}</strong>
                            <span className="float-end">{p.price_per_unit}</span>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                
                <div className="col-md-12 mb-3">
                    <label>Quantity Returned</label>
                    <input required={true} type='number' name="quantity" className="form-control" 
                    onChange={(e) => update("quantity", Number(e.target.value))} />
                </div>
              
                <div className="col-md-12     mb-3">
                    <label>Description</label>
                    <textarea required={true} name="description" className="form-control"  
                        onChange={(e) => update("description", e.target.value)} />
                </div>

                

                
                

                <div className="col-md-12-mb-2">
                    {/* Messages */}
                    {error && <div className="text-danger small mb-2">{error}</div>}
                    {success && (
                    <div className="text-success small mb-2">{success}</div>
                    )}
                </div> 

                {/* Submit */}
                 <div className="mb-3 col-md-6 offset-md-3">
                <button type="button" className="btn btn-danger w-100" disabled={saving}
                onClick={()=> handleSubmit() }
                >
                  {saving ? "Saving…" : "Confirm & Submit"}
                </button>
                </div>

                </div>
              </form>
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


