"use client"; 
import { useState } from "react";  
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients"; 
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function ContactPage() {

    const { data, mutate, isLoading } = useSWR(`/api/content/fetch/products`,  fetcher );
    const currentYear = new Date().getFullYear(); 
 
     


 
    if (isLoading) return;
    
    const products = data.data.products; 
    const content = data.data.content;
 
return ( 
<section style={{backgroundColor: "#f7f7f7", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: "#333" }}>
    

    {/* <!-- Header / Hero Section --> */}
    <header className="hero-header text-center">
        <div className="container" style={{maxWidth: "900px;"}}>
            <h1 className="fw-bold fs-3 mb-3">Clinical & Evidence-Based (Grounded in CBT/ACT)</h1>
             
            <p className="fw-semibold mb-0 fs-6">Order Received</p>
        </div>
    </header>

    {/* <!-- Main Content Section --> */}
    <main className="container main-content">
        <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
                <div className="checkout-card">
                    <div className="row g-4">
                        
                        {/* <!-- Left Column: Form Details --> */}
                        <div className="col-md-7 pe-md-4">

                            <div className="alert alert-success">
                                Order was saved successfully. We will get back very soon. Thank you.
                            </div>
                           
                        </div>

                        

                    </div>
                </div>
            </div>
        </div>
    </main>

    {/* <!-- Footer --> */}
    <footer className="text-center py-3">
        <div className="container">
            <p className="mb-0 small opacity-75">
                © {currentYear},{content?.org?.institution_name},All Rights Reserved.
            </p>
        </div>
    </footer>


            <JqueryMin />
            <BootstrapBundle />
            <MomentMin />
            <OverlayScrollbarsInit /> 
            <CustomMin />
</section>

 
)
}