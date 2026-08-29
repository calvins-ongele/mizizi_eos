"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import Swal from "sweetalert2";

interface Props {
  barcodeVal: string;
}


export default function Barcode({ barcodeVal }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  

  useEffect(() => {
    try {
    if (svgRef.current) {
      JsBarcode(svgRef.current, barcodeVal, {
        format: "EAN13",
        displayValue: true,
        fontSize: 18,
        height: 60,
        width: 2,
      });
    }
  } catch(e:any) {
    console.log(e);
    Swal.fire({
      text: `${e}. Please delete and recreate the product.`,
      icon:"error"
    });
    
  }
  }, [barcodeVal]);

  return <svg ref={svgRef}></svg>;
}