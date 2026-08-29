"use client"; 

import { useState, useEffect, useRef } from "react";
import { Toast } from "../../components/Toast";
import Swal from "sweetalert2";
import CustomerModal from "../dashboardmodals/page.dashboard.modal";
import { useSearchParams } from "next/navigation";
import PayModal from "../dashboardmodals/pay.dashboard.modal";
import useSWR from "swr";
import Loading from "../../components/Loading";
// import ReceiptModal from "./dashboardmodals/receipt.dashboard.modal";   
// import { setTimeout } from "timers/promises";

type ProductDB = {
  barcode: string;
  product_name: string;
  price_per_unit: string; // DB string
  quantity_available: string; // DB string
};
type CartItem = {
  barcode: string;
  product_name: string;
  price: number; // number
  available: number; // number
  qty: number; // UI-only
};


const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function POSDashboardPage() { 
  const [suggestions, setSuggestions] = useState<ProductDB[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
 
  const [openCustomerModal, setOpenCustomerModal] = useState<InvoiceModalType | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  //const [openReceiptModal, setOpenReceiptModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const [barcode, setBarcode] = useState("");
  const [query, setQuery] = useState("");
  const [pauseSale, setPauseSale] = useState(false);
  const [openPayModal, setOpenPayModal] = useState<PayType | null>(null);
  const searchParams = useSearchParams();//get data 
  const pausedUID = searchParams.get('uid');
  const [success, setSuccess] = useState("");
  const [printPaused, setPrintPaused] = useState(0);
 
  const { data, mutate, isLoading } = useSWR(
    `/api/auth/me`,
    fetcher
  );

  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        
        const response = await fetch(`/api/pos/suspended/single?uid=${pausedUID}`);
        
        // Read the response as a Blob 
        const cartData = await response.json(); 
        const realData = JSON.parse(cartData.data[0].cart_data);
        
        // Create a local URL for the blob object
         //setCart(cartData.data.cart_data);
         for(let i = 0; i < realData.length; i++) {
          const productRow = realData[i];
          addToCart({
            barcode: productRow.barcode,
            product_name: productRow.product_name,
            price_per_unit: productRow.price,
            quantity_available: productRow.available
          });
         }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    const pId = `${pausedUID || ""}`; 

    if (pId?.length > 0) 
    fetchCart(); 
  }, [pausedUID]);

   // This handles the data returned from the modal
  const handleCustomerSave = async (customerData: Customer) => {
    // Option A: Just save it to local state to use later
    setSelectedCustomer(customerData);
    console.log("Data received from modal:", customerData); 
    if (pauseSale) {
      sendSuspendSale();  
    }
 
  };
  const handlePayDoneSave = async (url:string) => {
    //setOpenReceiptModal(url);  
    setOpenPayModal(null);
    setCart([]);
    addHandled();
    setSelectedCustomer(null);
  }


  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  function toCartItem(p: ProductDB): CartItem {
    return {
      barcode: p.barcode,
      product_name: p.product_name,
      price: Number(p.price_per_unit),
      available: Number(p.quantity_available),
      qty: 1,
    };
  }

  const saleTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const moveSelection = (dir: "up" | "down") => {
    setSelectedIndex((i) =>
      dir === "up" ? Math.max(0, i - 1) : Math.min(cart.length - 1, i + 1)
    );
  };

  const changeQty = (delta: number) => {
    setCart((items) =>
      items.map((item, i) =>
        i === selectedIndex
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = () => {
    setCart((items) => items.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(0);
  };

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
      body: JSON.stringify({ search: q }),
    });

    const data = await res.json();

    const products: ProductDB[] = data.data || [];

    //  Auto-add if exactly one result
    if (products.length === 1) { 
      addToCart(products[0]);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (products.length === 0) {
      Toast({success:false, msg:"Product was not found!"});
      setBarcode("");
      playAudio();
    }

    function playAudio() {
      const audio = new Audio('/uploads/soundshelfstudio-ui-drop-error-521939.mp3');
      audio.currentTime = 0; // Rewind to the start if it was already playing
        audio.volume = 1;
        audio.play()
            .then(() => console.log('Audio playing successfully'))
            .catch(error => console.error('Audio playback failed:', error));
    }

    setSuggestions(products);
    setShowSuggestions(products.length > 0);
  }
  function addToCart(product: ProductDB) {
    const item = toCartItem(product);
    setShowSuggestions(false); 

    setCart((prev) => {
      const existing = prev.find((p) => p.barcode === item.barcode);

      if (existing) {
        if (existing.qty >= existing.available) return prev;
        return prev.map((p) =>
          p.barcode === item.barcode ? { ...p, qty: p.qty + 1 } : p
        );
      }

      if (item.available <= 0) return prev;
      return [...prev, item];
    });

    console.log("Added to cart:", cart);
    //  Clear input & keep focus
    addHandled();
  }

  async function voidSale() {
    setCart([]);
    addHandled();
    try {
    const pId = `${pausedUID || ""}`; 
    if (pId.length > 0) {


      const result = await Swal.fire({
        title: "Cancel this sale?",
        text: `The records will still be kept.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Cancel",
      });

      if (!result.isConfirmed) return;

      const response = await fetch("/api/pos/void-sale", {method:"POST", body:JSON.stringify({uid:pId})}); 
      const cancelResponse = await response.json();

      if (!cancelResponse.success) {
        Swal.fire({ 
          text: `${cancelResponse.message || "An error occurred"}`,
          icon: "error", 
        });
        return;
      }
      Swal.fire({ 
        text: `The sale was voided.`,
        icon: "success", 
      });
      
    }
    } catch(e) {}
    finally {}
  }
  async function suspendSale() {
    
    if (cart.length == 0) {
       Swal.fire({ 
        text: `At least one item is required`,
        icon: "error", 
      });
      return;
    }

    setOpenCustomerModal({id:"123"});
    setPauseSale(true);
  }
  function printInvoice() {
    setPrintPaused(1);
    setPauseSale(true);
    sendSuspendSale();  
  }

  async function saveAndPay() {
    //setOpenReceiptModal(null);
    if (cart.length == 0) {
       Swal.fire({ 
        text: `At least one item is required`,
        icon: "error", 
      });
      return;
    }

    
    const mycart = {
      cart,
      name: selectedCustomer?.customerName || '',
      email: selectedCustomer?.customerEmail || '',
      phone: selectedCustomer?.customerPhone || ''
    }
    const form = mycart;
    const response  = await fetch("/api/pos/savesale", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(form)
    });

    const results = await response.json();

    if (!results.success) {
      Swal.fire({ 
        text: `${results.message || "Incorrect data"}`,
        icon: "error", 
      });
      return;
    }

     
    setCart([]);
    setOpenPayModal({
      uid:results.data.uid || "", 
      sale_id:results.data.sale_id||0, 
      amount: results.data.amount||0,
      receipt_number:results.data.receipt_no||"",
      customer_phone: selectedCustomer?.customerPhone||'',
      customer_email: selectedCustomer?.customerEmail||'',
      customer_name: selectedCustomer?.customerName||'',
      paybill: results.data.paybill,
      account_no: results.data.account_no
    });



  }
  async function sendSuspendSale() {

    try { 
      if (cart.length == 0) {
        Swal.fire({ 
          text: `At least one item is required`,
          icon: "error", 
        });
        return;
      }
      
      const result = await Swal.fire({
        title: "Pause this sale?",
        text: `Suspended sales can be resumed later`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Suspend",
      });

      if (!result.isConfirmed) return;
      const mycart = {
        cart,
        name: selectedCustomer?.customerName || '',
        email: selectedCustomer?.customerEmail || '',
        phone: selectedCustomer?.customerPhone || '',
        printPaused
      }
      const form = mycart;
        const response  = await fetch("/api/pos/suspend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

      const results = await response.json();

      if (!results.success) {
        Swal.fire({ 
          text: `${results.message || "Incorrect data"}`,
          icon: "error", 
        });
        return;
      }

      
      Swal.fire({ 
        text: `${results.message || "Sale suspended"}`,
        icon: "success", 
      });

      // let the cart stay if printPaused is set, otherwise clear it
      if (printPaused !== 1)
        setCart([]);

    } catch(e){}

    finally {
      setPauseSale(false);
      setPrintPaused(0);
    }
  }
 

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    if (suggestions.length === 1) {
      addToCart(suggestions[0]);
    } else if (suggestions.length > 1) {
      setShowSuggestions(true);
    } else {
      // no result ... error sound
    }
  }

  const addHandled = () => {
    // later: API lookup  
    setQuery("");
    setBarcode("");
    inputRef.current?.focus();
  };

  async function logOut() {
    
    const result = await Swal.fire({
      title: "Logout?",
      text: `Are you sure you want to logout now?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, logout",
    });

    if (!result.isConfirmed) return;
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  
  async function printLastSlip() {
   
    setLoading(true); 
    try {
      
    const response = await fetch("/api/pos/last-slip",{method:"POST", body:JSON.stringify({uid:""})});
    const type = response.headers.get("X-Response-Type")||""; 
    if (type === 'pdf') { 
      const blob = await response.blob(); 
      const url = URL.createObjectURL(blob);
     // setOpenReceiptModal(url); 
  
     Swal.fire({ 
        text: `"Sale completed successfully"`,
        icon: "success", 
        timer: 3000,
      });
     
      return;
    }
    const result = await response.json();

    if (result.success) {
      
     Swal.fire({ 
        text: `"Sale completed successfully"`,
        icon: "success", 
        timer: 3000,
      });
     
      return;
    }
    Swal.fire({ 
        text: `${result.message || "An error occurred"}`,
        icon: "error", 
      });

    } catch(e) {}
    finally {
      setLoading(false);
    }
  }

  if (isLoading) return <Loading />

  return (
    <div className="container-fluid px-3 pt-2 mb-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-n4">
        <div className="d-flex gap-3">
          <strong>🤖 MiziziPOS</strong>
          <div className="small lh-sm d-flex mt-1 gap-2">
            <div>Cashier: <strong>{data.data.name}</strong></div>
            <div>Drawer ID: <strong>8341</strong></div>
            {/* <div>Salesperson: No Salesperson Selected</div> */}
            <div>Price Mode: <strong>Normal</strong></div>
            </div>
            </div>
           
          
        

        <div className="text-end p-2">
          <div className="small fw-bold">Sale Total</div>
          <div className="fs-4 fw-bold text-danger">KES {saleTotal.toFixed(2)}</div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-start mb-0">
         {selectedCustomer && (
              <div className="d-flex align-items-start mb-2">
                <h3>Selected Customer:</h3>
                <p className="mt-2">&nbsp;Name: <strong>{selectedCustomer.customerName}</strong></p>
                <p className="mt-2">&nbsp;Phone: <strong>{selectedCustomer.customerPhone}</strong></p>
              </div>
            )}
      </div>
      <hr/>

      {/* MAIN */}
      <div className="d-flex gap-3 mt-4" >
        {/* LEFT PANEL */}
        <div style={{ width: "68%" }}>
          <div className="table-container">
          <table className="table excel-table mb-2">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ width: 90 }} className="text-end">
                  Price
                </th>
                <th style={{ width: 60 }} className="text-center">
                  Qty
                </th>
                <th style={{ width: 110 }} className="text-end">
                  Sub Total
                </th>
              </tr>
            </thead>
            <tbody className="table-container">
              {cart.map((item, i) => (
                <tr
                  key={item.barcode}
                  className={i === selectedIndex ? "selected" : ""}
                  onClick={() => setSelectedIndex(i)}
                >
                  <td>{item.product_name}</td>
                  <td className="text-end">{item.price} </td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-end">
                    {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* ITEM CONTROLS */}
          <div className="d-flex gap-2 mb-2 " >
            <button className="pos-btn" onClick={() => moveSelection("up")}>
              ⬆ Up
            </button>
            <button className="pos-btn" onClick={() => moveSelection("down")}>
              ⬇ Down
            </button>
            <button className="pos-btn" onClick={() => changeQty(-1)}>
              Qty -
            </button>
            <button className="pos-btn" onClick={() => changeQty(1)}>
              Qty +
            </button>
            <button className="pos-btn btn-danger" onClick={removeItem}>
              ✖ Remove
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: "32%", marginTop: "-25px" }}>
          <label className="small fw-semibold mb-1">
            Barcode / Stock Code / Description
          </label>

          <div className="position-relative mb-2">
            <input
              className="form-control"
              ref={inputRef}
              value={barcode}
              autoFocus
              placeholder="Scan or type..."
              onChange={(e) => {
                setBarcode(e.target.value);
                setQuery(e.target.value); 
                searchProducts(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />

            {showSuggestions && suggestions.length > 1 && (
              <div className="pos-suggestions">
                {suggestions.map((p) => (
                  <div
                    key={p.barcode}
                    className="suggestion-item"
                    onClick={() => addToCart(p)}
                  >
                    <strong>{p.product_name}</strong>
                    <span className="float-end">{p.price_per_unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <div className="input-group mb-3">
            <input
                ref={inputRef}
              className="form-control"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan or type..."
            />
            <button className="btn btn-primary">Add</button>
          </div> */}

          {/* KEYPAD */}
          <div className="keypad mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} onClick={() => setBarcode((b) => b + n)}>
                {n}
              </button>
            ))}
            <button className="clear" onClick={() => setBarcode("")}>
              Clear
            </button>
            <button onClick={() => setBarcode((b) => b + "0")}>0</button>
            <button onClick={() => setBarcode((b) => b + ".")}>.</button>
          </div>

          <button className="enter-btn mb-2"
          onClick={()=>searchProducts(barcode)}
          >Enter</button>
        </div>

        {/* ACTIONS */}
        <div className="d-grid gap-1" style={{ width: 240 }}>
          <button className="action-btn btn-success" onClick={()=>saveAndPay()}><i className="bi bi-cash"></i> Pay</button>
          {/* <button className="action-btn">🔍 Product Search</button> */}
          <button className="action-btn" onClick={()=>printInvoice()}><i className="bi bi-printer"></i> Print Invoice</button>
          <button className="action-btn"><i className="bi bi-tag"></i> Price Change</button>
          <button className="action-btn"><i className="bi bi-percent text"></i> Discount</button>
          <button className="action-btn" onClick={suspendSale} ><i className="bi bi-pause"></i> Suspend Sale</button>
          <button className="action-btn btn-danger" onClick={voidSale}><i className="bi bi-x"></i> Clear / Void</button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="d-flex gap-2 mt-3">
        <button className="pos-btn"><i className="bi bi-gem"></i> Price Mode</button>
        <button className="pos-btn" onClick={()=>setOpenCustomerModal({id:"123"})}><i className="bi bi-person"></i> Customer</button>
        <button className="pos-btn" disabled={loading} onClick={()=>printLastSlip()}><i className="bi bi-printer"></i> {loading?"Loading...":"Print Last Slip"}</button>
        <button className="pos-btn"><i className="bi bi-list"></i> Menu</button>
        <button className="pos-btn" onClick={logOut}><i className="bi bi-box-arrow-right"></i> Log Out</button>
      </div>



        
        {openCustomerModal && (
            <CustomerModal
            enquiry={openCustomerModal}
            onClose={() => setOpenCustomerModal(null)}
            onSave={handleCustomerSave} 
            />
        )}
        {openPayModal && (
            <PayModal
            enquiry={openPayModal}
            onClose={() => setOpenPayModal(null)}
            onSave={handlePayDoneSave} 
            />
        )}
        {/* {openReceiptModal && (
            <ReceiptModal
            enquiry={openReceiptModal}
            onClose={() => setOpenReceiptModal(null)} 
            />
        )} */}
 
    </div>
  );
}
