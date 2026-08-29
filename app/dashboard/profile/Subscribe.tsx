"use client";
import { useEffect, useRef, useState } from "react"; 
import Loading from "@/app/components/Loading";
import useSWR from "swr";
 

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function Subscribe() {
 
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    
  const { data, mutate, isLoading } = useSWR(
    `/api/subscription/plans`,
    fetcher
  );

  if (isLoading) return Loading({height:200});

    return (
        <>
         <div className="row gx-4 justify-content-center mb-5">

            {data.data.map((plan:any, index:number) => {
             
            const isActive = selectedPlanId ? selectedPlanId === plan.uid : plan.is_favourite===1;
            return (
            <div className="col-xl-3 col-sm-4 mb-3" key={index} onClick={() => setSelectedPlanId(plan.uid)}>
                <a  
                className={`d-flex border border-3 rounded-3 p-3 ${isActive ? 'border-3 border-primary position-relative' : ''}`} >
                {isActive && <div className="ribbon-2-end">Selected</div>} 
                <div className="d-grid gap-3">
                    <i className={`bi ${plan.icon || 'bi-star'} text-primary fs-3`}></i>
                    <h5 className="m-0 fw-bold">KES{plan.monthly_price || 0}/<small className="fw-normal text-secondary">mo</small>
                    </h5>
                    <h6 className="m-0 text-uppercase">{plan.name || 'Plan'}</h6>
                </div>
                </a>
            </div>)
        })}
        {selectedPlanId && <div className="col-12 text-center mt-4">
            <a href={`/dashboard/profile/subscribe?uid=${selectedPlanId}`} className="btn btn-outline-primary form-control" onClick={() => alert(`Selected Plan ID: ${selectedPlanId}`)}>Subscribe</a>
        </div>}
        
 
        </div>
        </>
    );
}