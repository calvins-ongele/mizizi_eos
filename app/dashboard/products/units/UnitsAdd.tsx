'use client';
import { useEffect, useRef, useState } from 'react';

export default function UnitsAdd({
  editing,
  onSaved,
  clearEditing,
}: {
  editing: { id: string; name: string } | null;
  onSaved: () => void;
  clearEditing: () => void;
}) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  //  Populate input when row is clicked
  useEffect(() => {
    if (editing) {
      setName(editing.name);
      inputRef.current?.focus();
    }
  }, [editing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    await fetch(
      editing
        ? `/api/products/units/update/${editing.id}`
        : `/api/products/units/create`,
      {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }
    );

    setName('');
    clearEditing();
    onSaved(); //  refresh table
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm">
      <div className="card-body">
        <h6 className="fw-semibold mb-3">
          {editing ? 'Edit Unit' : 'Add Unit'}
        </h6>

        <div className="input-group">
          <input
            ref={inputRef}
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Unit name"
          />

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : editing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
}
