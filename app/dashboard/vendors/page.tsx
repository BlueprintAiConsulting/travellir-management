'use client';

import { useState } from 'react';
import { useAppState } from '../../context';
import { Vendor } from '../../types';
import VendorForm from '../../components/VendorForm';

const specialtyConfig: Record<string, { label: string; classes: string }> = {
  cleaning: { label: 'Cleaning', classes: 'bg-cyan-100 text-cyan-700' },
  plumbing: { label: 'Plumbing', classes: 'bg-blue-100 text-blue-700' },
  electrical: { label: 'Electrical', classes: 'bg-yellow-100 text-yellow-700' },
  maintenance: { label: 'Maintenance', classes: 'bg-orange-100 text-orange-700' },
  landscaping: { label: 'Landscaping', classes: 'bg-green-100 text-green-700' },
  security: { label: 'Security', classes: 'bg-purple-100 text-purple-700' },
};

type SortKey = 'name' | 'rating' | 'status' | 'specialty';

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: 'asc' | 'desc' }) {
  return (
    <span className="ml-1 text-slate-400">
      {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );
}

export default function VendorsPage() {
  const { state, dispatch } = useAppState();
  const { vendors, properties } = state;

  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = vendors
    .filter((v) => {
      const matchSearch =
        search === '' ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || v.status === filterStatus;
      const matchSpecialty = filterSpecialty === 'all' || v.specialty === filterSpecialty;
      return matchSearch && matchStatus && matchSpecialty;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'rating') cmp = a.rating - b.rating;
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortKey === 'specialty') cmp = a.specialty.localeCompare(b.specialty);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE_VENDOR', id });
    setDeleteConfirmId(null);
  }

  function starDisplay(rating: number) {
    const full = Math.floor(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vendors</h1>
          <p className="text-slate-500 text-sm mt-1">
            {vendors.filter((v) => v.status === 'active').length} active /{' '}
            {vendors.length} total vendors
          </p>
        </div>
        <button
          onClick={() => { setEditingVendor(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Specialties</option>
          <option value="cleaning">Cleaning</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="maintenance">Maintenance</option>
          <option value="landscaping">Landscaping</option>
          <option value="security">Security</option>
        </select>
      </div>

      {/* Vendor Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-slate-500 text-sm">No vendors found.</p>
          <button
            onClick={() => { setSearch(''); setFilterStatus('all'); setFilterSpecialty('all'); }}
            className="mt-3 text-blue-600 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Sort bar */}
          <div className="hidden sm:flex items-center gap-4 px-2 mb-2 text-xs text-slate-500 font-medium">
            <button onClick={() => handleSort('name')} className="hover:text-slate-800 flex items-center">
              Name <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
            </button>
            <button onClick={() => handleSort('specialty')} className="hover:text-slate-800 flex items-center">
              Specialty <SortIcon col="specialty" sortKey={sortKey} sortDir={sortDir} />
            </button>
            <button onClick={() => handleSort('rating')} className="hover:text-slate-800 flex items-center ml-auto">
              Rating <SortIcon col="rating" sortKey={sortKey} sortDir={sortDir} />
            </button>
            <button onClick={() => handleSort('status')} className="hover:text-slate-800 flex items-center">
              Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((vendor) => {
              const cfg = specialtyConfig[vendor.specialty] ?? {
                label: vendor.specialty,
                classes: 'bg-slate-100 text-slate-600',
              };
              const assignedProperties = properties.filter((p) =>
                vendor.assignedPropertyIds.includes(p.id)
              );

              return (
                <div
                  key={vendor.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-slate-200 rounded-full flex items-center justify-center text-base font-bold text-slate-600 flex-shrink-0">
                        {vendor.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm leading-tight">{vendor.name}</h3>
                        <div className="text-xs text-amber-500 mt-0.5">{starDisplay(vendor.rating)} <span className="text-slate-400">{vendor.rating.toFixed(1)}</span></div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                        vendor.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {vendor.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{vendor.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.classes}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {assignedProperties.length} {assignedProperties.length === 1 ? 'property' : 'properties'}
                    </span>
                  </div>

                  {assignedProperties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {assignedProperties.slice(0, 3).map((p) => (
                        <span key={p.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                          {p.name}
                        </span>
                      ))}
                      {assignedProperties.length > 3 && (
                        <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
                          +{assignedProperties.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    {deleteConfirmId === vendor.id ? (
                      <>
                        <span className="text-xs text-slate-600 mr-auto">Delete?</span>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="text-xs text-red-600 font-semibold hover:text-red-700"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingVendor(vendor); setShowForm(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(vendor.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-slate-500 text-center">
            Showing {filtered.length} of {vendors.length} vendors
          </div>
        </>
      )}

      {/* Vendor Form Modal */}
      {showForm && (
        <VendorForm
          vendor={editingVendor}
          onClose={() => { setShowForm(false); setEditingVendor(undefined); }}
        />
      )}
    </div>
  );
}
