"use client";
import OverlayScrollbarsInit from "../components/customscrollbar";
import { //ApexchartsMin,
   BootstrapBundle, ConversionsMin, CustomMin, IncomeMin, JqueryMin, JqueryRatyMin, MomentMin, SparklineMin, VisitsConversionsMin } from "../components/JsClients";
  
import SalesChart from "./stats/SalesStats";
 

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function HomeDashboardPage() {   
   
  return (
    <div className=" ">  
 
    <div className="space-y-6 "> 
      <div className="app-body bg-white">
        <SalesChart />
      </div>
    </div>

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
