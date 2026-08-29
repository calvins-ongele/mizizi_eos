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
import BarcodeModal from "./barcodemodal";

// From API
export type Category = {
  id: string;
  name: string;
};

export type ProductDefinition = {
  
      id?: number,
      name?: string,
      size?: string,
      unit?: string, //unit_id
      barcode?: string,
      category?: string,
      cost_price?: string,
      selling_price?: string,
      is_serialized?: number;
}

export default function CreateProductNamePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Category[]>([]);
  const [definitionsData, setDefinitionsData] = useState<ProductDefinition>();
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  let productid = searchParams.get('productid') || ''; 
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
   
  const nameRef = useRef<HTMLInputElement>(null);

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const unitOptions = units.map((u) => ({
    value: u.id,
    label: u.name,
  }));

  const [form, setForm] = useState({
    name: "",
    size: "",
    barcode: "",
    category_id: "",
    unit_id: "1", // default pcs
    cost_price: "",
    selling_price: "",
    is_serialized: false,
    serial_example: "",
    productid: "",
  });

  // Load categories on page load
  useEffect(() => {
    fetch("/api/products/categories")
      .then((r) => r.json())
      .then((res) => setCategories(res.data || []))
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoadingCats(false));
  }, []);
  useEffect(() => {
    fetch("/api/products/units")
      .then((r) => r.json())
      .then((res) => setUnits(res.data || []))
      .catch(() => setError("Failed to load units"))
      .finally(() => setLoadingCats(false));
  }, []);
  useEffect(() => {
    fetch("/api/products/definitionsData", {method:'post', body:JSON.stringify({id:productid}) })
      .then((r) => r.json())
      .then((res) => setDefinitionsData(res.data || {} ))
      .catch(() => setError("Failed to load definitions data"))
      .finally(() => setLoadingCats(false));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { 
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function updateDefs<K extends keyof typeof definitionsData>(key: K, value: (typeof definitionsData)[K]) {
    setDefinitionsData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    update("productid", productid);
    const sform = new FormData(e.target);
    sform.set("productid", productid ?? "");
    const payload = Object.fromEntries(sform.entries());

    console.log("Payload:", payload);

    if (
      !payload.name ||
      //!payload.category_id ||
      !payload.cost_price ||
      !payload.selling_price 
     // !payload.unit_id
    ) {
      setError("Name, category, unit, cost and selling price are required");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/products/definitions/create", {
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
      setForm({
        name: "",
        size: "",
        barcode: "",
        category_id: "",
        unit_id: "1",
        cost_price: "",
        selling_price: "",
        is_serialized: false,
        serial_example: "",
        productid: '',
      });
      setDefinitionsData({
          id: 0,
          name: "",
          size: "",
          unit: "",
          barcode: "",
          category: "",
          cost_price: "",
          selling_price: "",
          is_serialized: 0,
      } );

      //open modal
      setOpenModal(data.data.barcode || "" );
      setProductName(data.data.name || "");

      productid = '';
      nameRef.current?.focus();
    } finally {
      setSaving(false);
    }
  }

  if (loadingCats) return Loading({height:200});
   
  if (definitionsData && (productid.length >0)) {
    console.log("Def Category:", categoryOptions)
    //setUnit(definitionsData?.unit || "");
    //update("unit_id", definitionsData?.unit || "");
  }
  
 

  return (
    <div className="container-fluid px-3 pt-3">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Add Product Name</h5>

              <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="mb-2">
                  <label className="form-label">Product name</label>
                  <input
                    name="name"
                    ref={nameRef}
                    className="form-control"
                    defaultValue={definitionsData?.name || form.name}
                    onChange={(e) => update("name", e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Size */}
                <div className="mb-2">
                  <label className="form-label">Size / Variant</label>
                  <input
                    name="size"
                    className="form-control"
                    defaultValue={definitionsData?.size || form.size}
                    onChange={(e) => update("size", e.target.value)}
                    placeholder="e.g. 500ml, 50g"
                  />
                </div>
                {/* Units */}
                <div className="mb-2">
                  <label className="form-label">Units</label>
                  <Select
                    name="unit_id"
                    options={unitOptions}
                    value={ 
                      //unitOptions.find((o) => o.value === (unit) ) || null 
                      unitOptions.find((o) => o.value === (definitionsData?.unit || form.unit_id) ) || null
                    }
                    onChange={(opt) => update("unit_id", opt?.value || "") }
                    placeholder="Select unit"
                    isClearable
                  />
                </div>

                {/* Barcode */}
                <div className="mb-2">
                  <label className="form-label">Barcode <small style={{color:"grey"}}>(Leave empty to autogenerate)</small></label>
                  <input
                  name="barcode"
                    className="form-control"
                    defaultValue={definitionsData?.barcode || form.barcode}
                    onChange={(e) => update("barcode", e.target.value)}
                  />
                </div>

                {/* Category */}
                <div className="mb-2">
                  <label className="form-label">Category </label> 
                  <Select
                  name="category_id"
                    options={categoryOptions}
                    value={ 
                      categoryOptions.find(
                        (o) => o.value === (definitionsData?.category || form.category_id) ) || null
                    }
                    onChange={(opt) => update("category_id", opt?.value || "")}
                    placeholder="Select category"
                    isClearable
                  />
                </div>

                {/* Prices */}
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Cost price</label>
                    <input
                      name="cost_price"
                      type="number"
                      className="form-control"
                      defaultValue={definitionsData?.cost_price || form.cost_price}
                      onChange={(e) => update("cost_price", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Selling price</label>
                    <input
                    name="selling_price"
                      type="number"
                      className="form-control"
                      defaultValue={definitionsData?.selling_price || form.selling_price}
                      onChange={(e) => update("selling_price", e.target.value)}
                    />
                  </div>
                </div>

                {/* Serialized */}
                <div className="form-check mb-3">
                  <input
                  name="is_serialized"
                    type="checkbox"
                    className="form-check-input"
                    checked={definitionsData?.is_serialized==1 || form.is_serialized}
                    onChange={(e) => update("is_serialized", e.target.checked)}
                    id="is_serialized"
                  />
                  <label className="form-check-label" htmlFor="is_serialized">
                    This product uses serial numbers
                  </label>
                </div>
                {form.is_serialized && (
                  <div className="mb-2">
                    <label className="form-label">
                      Serial / Pattern
                    </label>
                    <input
                    name="serial_example"
                      className="form-control"
                      value={form.serial_example}
                      onChange={(e) => update("serial_example", e.target.value)}
                      placeholder="e.g. IMEI, SN-XXXX"
                    />
                  </div>
                )}

                {/* Messages */}
                {error && <div className="text-danger small mb-2">{error}</div>}
                {success && (
                  <div className="text-success small mb-2">{success}</div>
                )}

                {/* Submit */}
                <button className="btn btn-primary w-100" disabled={saving}>
                  {saving ? "Saving…" : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      
          {openModal && (
              <BarcodeModal
              barcode={openModal}
              productname={productName}
              onClose={() => setOpenModal(null)}
              onSave={()=>{}} 
              />
          )}

       
            <JqueryMin />
            <BootstrapBundle />
            <MomentMin />
            <OverlayScrollbarsInit /> 
            <CustomMin />
    </div>
  );
}


