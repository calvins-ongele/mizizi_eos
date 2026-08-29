"use client";
import OverlayScrollbarsInit from "../../components/customscrollbar";
import { //ApexchartsMin,
   BootstrapBundle, ConversionsMin, CustomMin, IncomeMin, JqueryMin, JqueryRatyMin, MomentMin, SparklineMin, VisitsConversionsMin } from "../../components/JsClients";

import { useState, useEffect, useRef } from "react";
import { Toast } from "../../components/Toast";
import Swal from "sweetalert2"; 
import { useSearchParams } from "next/navigation"; 
import useSWR from "swr";
import Loading from "../../components/Loading";
import POSDashboardPage from "./pos.home"; 
// import ReceiptModal from "./dashboardmodals/receipt.dashboard.modal";   
// import { setTimeout } from "timers/promises";
 

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function HomeDashboardPage() {  
   
  const [loading, setLoading] = useState(false); 
  const searchParams = useSearchParams();//get data  
  const [success, setSuccess] = useState("");
 
  const { data, mutate, isLoading } = useSWR(
    `/api/auth/me`,
    fetcher
  );

   
   

 
 
 
  

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
 

  if (isLoading) return <Loading /> 
  const user = data.data; 

  return (
    <div className=" ">  

        {(user.pos == 0) && ( 
          <section className="d-flex justify-content-center align-items-center vh-100">
            <h2 className="alert alert-danger text-center"
            >The POS dashboard is not Activated</h2>
          </section>
        ) }
        {(user.pos === 1) && ( 
          <POSDashboardPage /> 
        ) }  
   
 
           

       <JqueryMin />
            <BootstrapBundle />
            <MomentMin /> 
            <OverlayScrollbarsInit /> 
            {/* <ApexchartsMin/> */}
            <SparklineMin />
            <ConversionsMin />
            <IncomeMin />
            <VisitsConversionsMin/>
            <JqueryRatyMin/> 
      
            <CustomMin />
    </div>
  );
}
