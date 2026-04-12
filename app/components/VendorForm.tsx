'use client';

import { useState } from 'react';
import { Vendor, VendorSpecialty, VendorStatus } from '../types';
import { useAppState } from '../context';
import Modal from './Modal';

interface VendorFormProps {
  vendor?: Vendor;
  onClose: () => void;
}

const specialtyOptions: { value: VendorSpecialty; label: string }[] = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'maintenance', label: 'General Maintenance' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'security', label: 'Security' },
];

const statusOptions: { value: VendorStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

function generateId() {
  return `vendor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function VendorForm({ vendor, onClose }: VendorFormProps) {
  const { dispatch } = useAppState();
  const isEdit = Boolean(vendor);

  const [form, setForm] = useState({
    name: vendor?.name ?? '',
    email: vendor?.email ?? '',
    phone: vendor?.phone ?? '',
    specialty: vendor?.specialty ?? ('cleaning' as VendorSpecialty),
    status: vendor?.status ?? ('active' as VendorStatus),
    rating: vendor?.rating ?? 5.0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function validate() {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (form.rating < 1 || form.rating > 5) errs.rating = 'Rating must be between 1 and 5';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEdit && vendor) {
      dispatch({
        type: 'UPDATE_VENDOR',
        payload: { ...vendor, ...form },
      });
    } else {
      dispatch({
        type: 'ADD_VENDOR',
        payload: {
          id: generateId(),
          ...form,
          assignedPropertyIds: [],
          createdAt: new Date().toISOString(),
        },
      });
    }
    onClose();
  }

  const field =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const label = 'block text-sm font-medium text-slate-700 mb-1';
  const errorText = 'text-xs text-red-600 mt-1';

  return (
    <Modal title={isEdit ? 'Edit Vendor' : 'Add New Vendor'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Vendor / Company Name *</label>
          <input
            className={field}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Sparkling Clean Co."
          />
          {errors.name && <p className={errorText}>{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Email *</label>
            <input
              type="email"
              className={field}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="info@vendor.com"
            />
            {errors.email && <p className={errorText}>{errors.email}</p>}
          </div>
          <div>
            <label className={label}>Phone *</label>
            <input
              type="tel"
              className={field}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(555) 000-0000"
            />
            {errors.phone && <p className={errorText}>{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Specialty</label>
            <select
              className={field}
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value as VendorSpecialty })}
            >
              {specialtyOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Status</label>
            <select
              className={field}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as VendorStatus })}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Rating (1–5)</label>
          <input
            type="number"
            min={1}
            max={5}
            step={0.1}
            className={field}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          />
          {errors.rating && <p className={errorText}>{errors.rating}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isEdit ? 'Save Changes' : 'Add Vendor'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
