"use client";
import { useEffect } from "react"; 

export function JqueryMin() {
  useEffect(() => {
    require("jquery/dist/jquery.min.js"); 
  }, []);

  return null;
}
export function BootstrapBundle() {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []); 
  return null; 
}
export function MomentMin() {
  useEffect(() => {
    require("moment/min/moment.min.js"); 
  }, []); 
  return null;
}
export function OverlayMin() {
  useEffect(() => {
    require("@/app/components/overlay.js");
  }, []); 
  return null;
}
 
export function ApexchartsMin() {
  useEffect(() => {  
    require("apexcharts/dist/apexcharts.min.js");
  }, []); 
  return null;
}
export function SparklineMin() {
  // useEffect(() => {  
  //   require("@/app/components/sparkline.js");
  // }, []); 
  return null;
}
export function ConversionsMin() {
  // useEffect(() => {  
  //   require("@/app/components/conversions.js");
  // }, []); 
  return null;
}
export function IncomeMin() {
  // useEffect(() => {  
  //   require("@/app/components/income.js");
  // }, []); 
  return null;
}
export function VisitsConversionsMin() {
  // useEffect(() => {  
  //   require("@/app/components/visits-conversions.js");
  // }, []); 
  return null;
}
export function JqueryRatyMin() {
  useEffect(() => {  
    require("@/app/components/jquery.raty.js");
  }, []); 
  return null;
}

export function CustomMin() {
  useEffect(() => {  
    require("@/app/components/custom.js");
  }, []);
  return null;
}
