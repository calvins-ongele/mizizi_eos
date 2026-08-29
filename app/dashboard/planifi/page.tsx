"use client"; 
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
import CreatePlanModal from "./CreatePlanModal";

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
export { toIso } from "@/engine/utils/dates";

const localizer = momentLocalizer(moment)

type TitleTasks = {
    
    id: number,
    title: string,
    start_date: string,
    end_date: string,
    notes?: string,
}

export default function PlanifiPage() {

  const [selected, setSelected] = useState<CreateSchedule | null>(null);
  const [rows, setRows] = useState<TitleTasks[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch("/api/schedule", { method: "GET" })
      .then(res => res.json())
      .then(data => { 
        setRows(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return;
 
    const events = rows.map(row=> ({ 
        id: row.id,
        title: row.title || 'Unnamed Event',
        start: new Date(row.start_date),
        end: new Date(row.end_date),
        notes:row.notes
    }));
  
    
    const eventStyleGetter = (event:any) => {
        const eventType:string = event.type|| "";
        let backgroundColor = '#28a745';
        switch (eventType.toLocaleLowerCase() ) {
            case 'Meeting'.toLocaleLowerCase() || eventType.startsWith('Meeting'.toLocaleLowerCase()):  
                backgroundColor = '#3e0858';
                break; 
            case 'Interview'.toLocaleLowerCase():  
                backgroundColor =  '#f8b745'; 
                break; 
            case 'Task'.toLocaleLowerCase():  
                backgroundColor =  '#28a790'; 
                break; 
            case 'Stock'.toLocaleLowerCase():  
                backgroundColor =  '#635330'; 
                break; 
            case 'Maintenance'.toLocaleLowerCase():  
                backgroundColor =  '#a7283f'; 
                break; 
            case 'Finance'.toLocaleLowerCase():  
                backgroundColor =  '#28a745'; 
                break; 
            case 'Customer'.toLocaleLowerCase():  
                backgroundColor =  '#3174ad'; 
                break; 
            case 'Marketing'.toLocaleLowerCase():  
                backgroundColor =  '#2835a7'; 
                break; 
            case 'Reminder'.toLocaleLowerCase():  
                backgroundColor =  '#cb7d08'; 
                break; 
            case 'Delivery'.toLocaleLowerCase():  
                backgroundColor =  '#dc3545'; 
                break; 
            case 'Audit'.toLocaleLowerCase():  
                backgroundColor =  '#a73b28'; 
                break; 
            case 'Therapy Session'.toLocaleLowerCase():  
                backgroundColor =  '#289fa7'; 
                break; 
            default:
                backgroundColor = '#28a745';
        } 

        return { style: { backgroundColor } };

        
    };

    if (loading) return Loading({height:200}); 

    return (
        <div className="container-fluid px-3 pt-3"> 
            <div className="app-body">
                <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                style={{ height: 500 }}
                onSelectEvent={(event) => {
                    console.log(event);
                }}
                selectable
                onSelectSlot={(slotInfo) => {  
                    //confirm create event 
                    const data:CreateSchedule = {
                        id: 1,
                        date_start: new Date(slotInfo.start).toISOString().slice(0, 19).replace('T', ' '),
                        date_end: new Date(slotInfo.end).toISOString().slice(0, 19).replace('T', ' ')
                    }
                    setSelected(data);

                }}
                
                />
            </div>

        
        
        {selected && (
            <CreatePlanModal
            enquiry={selected}
            onClose={() => setSelected(null)}
            />
        )}

        <JqueryMin />
        <BootstrapBundle />
        <MomentMin />
        <OverlayScrollbarsInit /> 
        <CustomMin />
        </div>
    )
}