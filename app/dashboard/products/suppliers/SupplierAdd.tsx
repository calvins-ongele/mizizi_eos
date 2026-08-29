'use client';
import { useEffect, useRef, useState } from 'react';

export default function SupplierAdd({
  editing,
  onSaved,
  clearEditing,
}: {
  editing: { id: string; name: string; email:string; phone:string } | null;
  onSaved: () => void;
  clearEditing: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  //  Populate input when row is clicked
  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setEmail(editing.email);
      setPhone(editing.phone);
      inputRef.current?.focus();
    }
  }, [editing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPhoneError('');

    if (!name.trim()) {
      inputRef.current?.focus();
      setNameError('Supplier name is required');
      return;
    }
    if (!email.trim()) {
      inputRef.current?.focus();
      setEmailError('Supplier email is required');
      return;
    }
    if (!phone.trim()) {
      inputRef.current?.focus();
      setPhoneError('Supplier phone is required');
      return;
    }

    setLoading(true);

    await fetch(
      editing
        ? `/api/products/suppliers/update/${editing.id}`
        : `/api/products/suppliers/create`,
      {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      }
    );

    setName('');
    setEmail('');
    setPhone('');
    clearEditing();
    onSaved(); //  refresh table
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm">
      <div className="card-body">
        <h6 className="fw-semibold mb-3">
          {editing ? 'Edit Supplier' : 'Add Supplier'}
        </h6>

        <div className="mb-3 d-flex flex-column gap-2">
          <input
            ref={inputRef}
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Supplier name"
          />
          {nameError && <div className="text-danger">{nameError}</div>}
          <input
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Supplier email"
          />
          {emailError && <div className="text-danger">{emailError}</div>}
          <input
            className="form-control"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Supplier phone"
          />
          {phoneError && <div className="text-danger">{phoneError}</div>}

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : editing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
}
