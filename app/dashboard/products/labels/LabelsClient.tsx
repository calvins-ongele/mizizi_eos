'use client';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function LabelsClient( ) {
  const [text, setText] = useState('');
  const [fsize, setFSize] = useState('7');
  const [copies, setCopies] = useState('1');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    if (!copies.trim()) return;
    if (!fsize.trim()) return;

    if (Number(fsize) > 7 || (Number(fsize) < 1)) {
        Swal.fire({
            text:"Font size must be between 1 and 7",
            icon:"error",
        });
        return;
    }

    setLoading(true);

    await fetch( 
        `/api/pos/print-label`,
       
      {
        method: 'POST', 
        body: JSON.stringify({ text, fsize, copies }),
      }
    );
 
    setLoading(false);
  }

  return (
    <section className='container'>
        <div className='alert d-flex justify-content-center'>
            <form onSubmit={handleSubmit} className="card shadow-sm" style={{minWidth:"400px"}}>
                <div className="card-body">
                    <h6 className="fw-semibold mb-3">
                    Print a shop label
                    </h6>

                    <div className="form-group mb-3">
                        <label>Text to Print</label>
                    <input
                        ref={inputRef}
                        className="form-control" 
                        onChange={e => setText(e.target.value)}
                        placeholder="Text to print"
                    />
                    </div>
                    <div className="form-group mb-3"> 
                        <label>Font Size</label>
                    <input 
                        className="form-control" 
                        value={fsize} type='number'
                        onChange={e => setFSize(e.target.value)}
                        placeholder="Font Size"
                    />
                    </div>
                    <div className="form-group mb-3">
                    <label className='d-block'>Number of copies</label>
                    <input 
                        className="form-control"  type='number'
                        value={copies}
                        onChange={e => setCopies(e.target.value)}
                        placeholder="Number of copies"
                    />
                    </div>

                    <button className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving…' : 'Print Label'}
                    </button>
                
                </div>
                </form>
        </div>
    </section>
  );
}
