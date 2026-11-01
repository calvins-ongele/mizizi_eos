"use client";
import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients";
import { useSearchParams } from 'next/navigation';
import Loading from "@/app/components/Loading";
 
export type ProductDefinition = {
  
      id?: number,
      name?: string, 
      barcode?: string, 
      cost_price?: string,
      selling_price?: string,
      quantity?: number;
      supplier_id?: number;
}

export type Supplier = {
    id: number,
    name: string,
    email: string,
    phone: string
}

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
export default function CreateProductNamePage() { 
  const [definitionsData, setDefinitionsData] = useState<ProductDefinition>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  let supplyId = searchParams.get('supplyId') || ''; 
   
  const nameRef = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState("");
  const [suggestions, setSuggestions] = useState<ProductDB[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);

    
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
 

  const supplierOptions = suppliers.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const [form, setForm] = useState({
    name: "", 
    barcode: "", 
    cost_price: "",
    selling_price: "", 
    quantity: 0,
    productid: "",
    supplier_id: 0,
    productQuantity:0
  });

  // Load categories on page load

  useEffect(() => {
    fetch("/api/products/definitionsData", {method:'post', body:JSON.stringify({id:supplyId}) })
      .then((r) => r.json())
      .then((res) => setDefinitionsData(res.data || {} ))
      .catch(() => setError("Failed to load definitions data"))
      .finally(() => setLoadingCats(false));
  }, []);
  useEffect(() => {
    fetch("/api/products/suppliers")
      .then((r) => r.json())
      .then((res) => setSuppliers(res.data || []))
      .catch(() => setError("Failed to load suppliers"))
      .finally(() => setLoadingCats(false));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { 
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function updateDefs<K extends keyof typeof definitionsData>(key: K, value: (typeof definitionsData)[K]) {
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
        supplier_id:form.supplier_id || 0,
        quantity:0,
      });
      setBarcode("");
      inputRef.current?.focus();
  }
  async function addRow() {
    if (!definitionsData) return;
    const newItem: CartItem = {
      barcode: barcode || "",
      product_name: form.name || "",
      price: parseFloat(form.cost_price || "0"),
      supplier_id: form.supplier_id || 0,
      available:0,
      qty: parseInt(form.productQuantity?.toString() || "0"),
      product_definition_id: form.productid || "0",
    };
    console.log("Adding to cart:", form);
    if (newItem.product_definition_id === "0" || newItem.product_definition_id === "") {
      setError("Please select a product before adding to cart.");
      return;
    }
    // quantity must be >0
    if (newItem.qty <= 0) {
      setError("Quantity must be greater than zero");
      return;
    }
    if (form.barcode.trim() === "") {
        setError("Barcode cannot be empty. Please select a product.");
        return;
    }
    if (form.supplier_id == 0 || Number(form.supplier_id) == 0) {
        setError("Please select a supplier.");
        return;
    }
    setCart((prev) => [...prev, newItem]);
    setCartCount((prev) => prev + 1);
    resetForm();
    
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    update("productid", supplyId);

    if (cart.length === 0) {
      setError("Cart is empty. Please add at least one item.");
      return;
    } 
    //prepare payload with cart items
    const payload = {
      ...form,
      cart: cart
    }; 
    console.log("Payload:", payload); 
    try {
      setSaving(true);
      const res = await fetch("/api/products/purchases/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to save product");
        return;
      }

      setSuccess("Product name saved successfully");
      resetForm();
      setCart([]);
      setCartCount(0);
      setDefinitionsData({
          id: 0,
          name: "",  
          barcode: "", 
          cost_price: "",
          selling_price: "", 
          quantity:0,
          supplier_id:0
          }
      );
      supplyId = '';
      nameRef.current?.focus();
    } finally {
      setSaving(false);
    }
  }
  

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

  if (loadingCats) return Loading({height:200});
    

  return (
    <div className="container-fluid px-3 pt-3 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Add Supplies</h5>

              <form onSubmit={handleSubmit}>
                <div className="row">

                <div className="col-md-6 position-relative mb-3"> 
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
                
                {/* Suppliers */}
                <div className="mb-3 col-md-6">
                  <label className="form-label">Supplier</label>
                  <Select
                    name="supplier_id"
                    options={supplierOptions}
                    value={   
                      supplierOptions.find((o) => o.value === (definitionsData?.supplier_id || form.supplier_id) ) || null
                    }
                    onChange={(opt) => update("supplier_id",  Number(`${opt?.value ?? 0}`) ) }
                    placeholder="Select supplier"
                    isClearable
                  />
                </div>

                {/* Supplies */}
                <div className="mb-3 col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    name="name"
                    ref={nameRef} readOnly={true}
                    className="form-control"
                    defaultValue={definitionsData?.name || form.name}
                    onChange={(e) => update("name", e.target.value)}
                    autoFocus
                  />
                </div> 

                {/* Quantity */}
                <div className="mb-3 col-md-6">
                  <label className="form-label">Quantity</label>
                  <input
                    name="quantity"
                    className="form-control"
                    value={form.productQuantity ?? 0}
                    onChange={(e) => update("productQuantity", Number(e.target.value))}
                  />
                </div> 

                {/* Prices */}
               
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cost price</label>
                    <input
                      name="cost_price"
                      type="number"
                      className="form-control"
                      defaultValue={definitionsData?.cost_price || form.cost_price}
                      onChange={(e) => update("cost_price", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Selling Price (<span className="text-muted fs-8">Change SP at Product Definitions</span>)</label>
                    <input readOnly={true}
                    name="selling_price"
                      type="number"
                      className="form-control"
                      defaultValue={definitionsData?.selling_price || form.selling_price}
                      onChange={(e) => update("selling_price", e.target.value)}
                    />
                  </div>
                

                {/* Messages */}
                {error && <div className="text-danger small mb-2">{error}</div>}
                {success && (
                  <div className="text-success small mb-2">{success}</div>
                )}


                {/* Submit */}
                <div className="">
                    <h6 className="fw-semibold mb-2">Total ({cartCount})</h6>
                </div>
                <div className="mb-3 col-md-6">
                <button className="btn btn-secondary w-100 mb-3" onClick={addRow} type="button" disabled={saving}>
                  {saving ? "Saving…" : "Add"}
                </button>
                </div>

                {/* Submit */}
                 <div className="mb-3 col-md-6">
                <button className="btn btn-danger w-100" disabled={saving}>
                  {saving ? "Saving…" : "Submit & Print Received Note"}
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


