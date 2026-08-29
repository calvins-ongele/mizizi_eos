// app/login/page.tsx
"use client";

import TruncateText from "@/app/components/TruncateText";
import { useState } from "react";

let i = 0;
type Product = {
  barcode: string;
  product_name: string;
  price_per_unit: string;
  quantity_available: string;
  qty?:number
};
export function SearchForm({ cname, logo }: any) {
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [htm, setHtm] = useState("");
  const [rows, setRows] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    const form = new FormData();
    form.set("search", searchInput);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      let msg = data?.message;
      if (data?.details) {
        msg += `: ${data?.details[0]["message"]}`;
      }
      setError(msg || "Invalid credentials");
    } else {
      setRows(data.data);
    }
  }

  function handleClick(  row: Product) { 
    
    //setCart(prev => [...prev, row]);
     let newrow:Product = {
        barcode: row.barcode,
        product_name: row.product_name,
        price_per_unit: row.price_per_unit,
        quantity_available: row.quantity_available,
        qty: 1
    };
    
    setCart(prev => {
        // Optional: prevent duplicates
        if (prev.some(p => p.barcode === row.barcode)) return prev;
        return [...prev, newrow];
    });
    
  }

  function handleRemove(row:Product) {

  }

  return (
    <div className="">
      {/* <!-- Container starts --> */}

      {error && <p className="alert alert-sm text-danger">{error}</p>}

      <div className="row gx-4">
        <div className="col-12">
          <div className="card mb-2">
            <div className="card-header">
              <h5 className="card-title">Sales Input</h5>
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="card mb-4">
            <div className="card-body">
              <label htmlFor="searchWithButton" className="form-label">
                Search your products
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="searchWithButton"
                  placeholder="Search term..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  type="button"
                >
                  Search
                </button>
              </div>

              <div className="table-outer table-responsive ">
                <table className="table table-sm table-hover tablerespY">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Qty</th>
                    </tr>
                  </thead> 
                  <tbody style={{ fontSize: "10px" }}>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                          No data
                        </td>
                      </tr>
                    ) : (
                      rows.map((row) => (
                        <tr
                          key={row.barcode}
                          className="cursor"
                          onClick={() => handleClick(row)}
                        >
                          <td>
                            <TruncateText value={row.barcode} maxLength={8} />
                          </td>
                          <td>{row.product_name}</td>
                          <td>{row.price_per_unit}</td>
                          <td>{row.quantity_available}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-7">
          <div className="card mb-4">
            <div className="card-body">
              <label htmlFor="searchWithButtond" className="form-label">
                Search your products
              </label>

              {/* <!-- Responsive table --> */}
              <div className="table-outer table-responsive ">
                <table className="table table-sm table-hover tablerespY">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Qty</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "10px" }}>
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                          No data
                        </td>
                      </tr>
                    ) : (
                      cart.map((crow) => (
                        <tr
                          key={crow.barcode}
                          className="cursor"
                          onClick={() => handleRemove(crow)}
                        >
                          <td>
                            <TruncateText value={crow.barcode} maxLength={8} />
                          </td>
                          <td>{crow.product_name}</td>
                          <td>{crow.price_per_unit}</td>
                          <td><input style={{border:"none", outline:'none'}} type='number' value={crow.qty} /> </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End of login */}
    </div>
  );
}
