'use client';

import { useState } from 'react';
import { Property, PropertyType, PropertyStatus } from '../types';
import { useAppState } from '../context';
import Modal from './Modal';

interface PropertyFormProps {
  property?: Property;
  onClose: () => void;
}

const typeOptions: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
  { value: 'cabin', label: 'Cabin' },
];

const statusOptions: { value: PropertyStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Under Maintenance' },
];

function generateId() {
  return `prop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function PropertyForm({ property, onClose }: PropertyFormProps) {
  const { dispatch } = useAppState();
  const isEdit = Boolean(property);

  const [form, setForm] = useState({
    name: property?.name ?? '',
    address: property?.address ?? '',
    city: property?.city ?? '',
    state: property?.state ?? '',
    type: property?.type ?? ('apartment' as PropertyType),
    bedrooms: property?.bedrooms ?? 1,
    bathrooms: property?.bathrooms ?? 1,
    nightlyRate: property?.nightlyRate ?? 100,
    status: property?.status ?? ('available' as PropertyStatus),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function validate() {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (form.bedrooms < 1) errs.bedrooms = 'Must have at least 1 bedroom';
    if (form.bathrooms < 1) errs.bathrooms = 'Must have at least 1 bathroom';
    if (form.nightlyRate <= 0) errs.nightlyRate = 'Rate must be positive';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEdit && property) {
      dispatch({
        type: 'UPDATE_PROPERTY',
        payload: { ...property, ...form },
      });
    } else {
      dispatch({
        type: 'ADD_PROPERTY',
        payload: {
          id: generateId(),
          ...form,
          assignedVendorIds: [],
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
    <Modal title={isEdit ? 'Edit Property' : 'Add New Property'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Property Name *</label>
          <input
            className={field}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Ocean View Villa"
          />
          {errors.name && <p className={errorText}>{errors.name}</p>}
        </div>

        <div>
          <label className={label}>Address *</label>
          <input
            className={field}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. 123 Seaside Drive"
          />
          {errors.address && <p className={errorText}>{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>City *</label>
            <input
              className={field}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Miami"
            />
            {errors.city && <p className={errorText}>{errors.city}</p>}
          </div>
          <div>
            <label className={label}>State *</label>
            <input
              className={field}
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              placeholder="FL"
              maxLength={2}
            />
            {errors.state && <p className={errorText}>{errors.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Property Type</label>
            <select
              className={field}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
            >
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Status</label>
            <select
              className={field}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={label}>Bedrooms</label>
            <input
              type="number"
              min={1}
              className={field}
              value={form.bedrooms}
              onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
            />
            {errors.bedrooms && <p className={errorText}>{errors.bedrooms}</p>}
          </div>
          <div>
            <label className={label}>Bathrooms</label>
            <input
              type="number"
              min={1}
              className={field}
              value={form.bathrooms}
              onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
            />
            {errors.bathrooms && <p className={errorText}>{errors.bathrooms}</p>}
          </div>
          <div>
            <label className={label}>Nightly Rate ($)</label>
            <input
              type="number"
              min={1}
              className={field}
              value={form.nightlyRate}
              onChange={(e) => setForm({ ...form, nightlyRate: Number(e.target.value) })}
            />
            {errors.nightlyRate && <p className={errorText}>{errors.nightlyRate}</p>}
          </div>
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
            {isEdit ? 'Save Changes' : 'Add Property'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
