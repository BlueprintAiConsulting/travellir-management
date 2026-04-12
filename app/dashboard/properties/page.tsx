'use client';

import { useState } from 'react';
import { useAppState } from '../../context';
import { Property } from '../../types';
import PropertyForm from '../../components/PropertyForm';

const statusConfig = {
  available: { label: 'Available', classes: 'bg-green-100 text-green-700' },
  occupied: { label: 'Occupied', classes: 'bg-blue-100 text-blue-700' },
  maintenance: { label: 'Maintenance', classes: 'bg-amber-100 text-amber-700' },
};

const typeLabels: Record<string, string> = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa',
  condo: 'Condo',
  cabin: 'Cabin',
};

type SortKey = 'name' | 'nightlyRate' | 'status' | 'createdAt';

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: 'asc' | 'desc' }) {
  return (
    <span className="ml-1 text-slate-400">
      {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );
}

export default function PropertiesPage() {
  const { state, dispatch } = useAppState();
  const { properties, vendors } = state;

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = properties
    .filter((p) => {
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchType = filterType === 'all' || p.type === filterType;
      return matchSearch && matchStatus && matchType;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'nightlyRate') cmp = a.nightlyRate - b.nightlyRate;
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortKey === 'createdAt')
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE_PROPERTY', id });
    setDeleteConfirmId(null);
  }

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Properties</h1>
          <p className="text-slate-500 text-sm mt-1">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} in your portfolio
          </p>
        </div>
        <button
          onClick={() => { setEditingProperty(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, city or address…"
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
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="condo">Condo</option>
          <option value="cabin">Cabin</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-slate-500 text-sm">No properties found.</p>
          <button
            onClick={() => { setSearch(''); setFilterStatus('all'); setFilterType('all'); }}
            className="mt-3 text-blue-600 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none hover:text-slate-800"
                    onClick={() => handleSort('name')}
                  >
                    Property <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                    Type
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                    Details
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none hover:text-slate-800"
                    onClick={() => handleSort('nightlyRate')}
                  >
                    Rate <SortIcon col="nightlyRate" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none hover:text-slate-800"
                    onClick={() => handleSort('status')}
                  >
                    Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden xl:table-cell">
                    Vendors
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((property) => {
                  const assignedVendors = vendors.filter((v) =>
                    property.assignedVendorIds.includes(v.id)
                  );
                  const cfg = statusConfig[property.status];
                  return (
                    <tr key={property.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{property.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {property.address}, {property.city}, {property.state}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-slate-600">
                        {typeLabels[property.type]}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-slate-600">
                        {property.bedrooms}bd / {property.bathrooms}ba
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        ${property.nightlyRate}<span className="text-xs text-slate-400">/night</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.classes}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden xl:table-cell">
                        {assignedVendors.length === 0 ? (
                          <span className="text-xs text-slate-400">None assigned</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {assignedVendors.slice(0, 2).map((v) => (
                              <span key={v.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {v.name.split(' ')[0]}
                              </span>
                            ))}
                            {assignedVendors.length > 2 && (
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                +{assignedVendors.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {deleteConfirmId === property.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-slate-600">Delete?</span>
                            <button
                              onClick={() => handleDelete(property.id)}
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
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setEditingProperty(property); setShowForm(true); }}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(property.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {properties.length} properties
          </div>
        </div>
      )}

      {/* Property Form Modal */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onClose={() => { setShowForm(false); setEditingProperty(undefined); }}
        />
      )}
    </div>
  );
}
