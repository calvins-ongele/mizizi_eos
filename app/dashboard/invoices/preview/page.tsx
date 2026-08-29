"use client"; 
import { useEffect, useRef, useState } from "react";
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients"; 
import { uuid } from "@/engine/utils/crypto";
import { useSearchParams  } from 'next/navigation';
import useSWR from "swr";
import Loading  from "@/app/components/Loading";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CreateInvoicePage() { 
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();//get data  

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`/api/invoices/preview?uid=${searchParams.get('uid')}`);
        
        // Read the response as a Blob 
        const blob = await response.blob(); 
        // Create a local URL for the blob object
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    // Clean up the object URL when component unmounts to save memory
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [`${searchParams.get('uid')}`]);

  if (loading) return Loading({height:200}); 

    return (
        <div className="container-fluid px-3 pt-2">
            <div className="row gx-4">
              <div className="col-xxl-9 col-sm-12">

                <div className="card mb-4">
                  <div className="card-body">
                    
                    
                    <div style={{ width: '100%', height: '800px' }}>
                    {pdfUrl ? (
                        <iframe
                        src={pdfUrl}
                        width="100%"
                        height="100%"
                        title="Invoice PDF"
                        style={{ border: 'none' }}
                        />
                    ) : (
                        <p>Failed to load PDF.</p>
                    )}
                    </div>

                   
                    {/* <!-- Row end --> */}
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