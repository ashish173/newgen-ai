import { InputHTMLAttributes } from 'react';

export default function FormInput({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span>{label}</span>
      <input {...props} className={`mt-1 w-full border rounded px-3 py-2 ${props.className || ''}`} />
    </label>
  );
}
