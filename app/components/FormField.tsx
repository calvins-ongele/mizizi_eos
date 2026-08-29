// app/components/FormField.tsx
"use client";

export function FormField({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
