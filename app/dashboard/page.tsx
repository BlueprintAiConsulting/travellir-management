'use client';

import { useAppState } from '../context';
import StatCard from '../components/StatCard';
import Link from 'next/link';

const propertyStatusColors = {
  available: 'bg-green-100 text-green-700',
  occupied: 'bg-blue-100 text-blue-700',
  maintenance: 'bg-amber-100 text-amber-700',
};

const vendorSpecialtyColors: Record<string, string> = {
  cleaning: 'bg-cyan-100 text-cyan-700',
  plumbing: 'bg-blue-100 text-blue-700',
  electrical: 'bg-yellow-100 text-yellow-700',
  maintenance: 'bg-orange-100 text-orange-700',
  landscaping: 'bg-green-100 text-green-700',
  security: 'bg-purple-100 text-purple-700',
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function DashboardPage() {
  const { state } = useAppState();
  const { properties, vendors } = state;

  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.status === 'available').length;
  const occupiedProperties = properties.filter((p) => p.status === 'occupied').length;
  const maintenanceProperties = properties.filter((p) => p.status === 'maintenance').length;

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === 'active').length;

  const totalMonthlyRevenue = properties
    .filter((p) => p.status === 'occupied')
    .reduce((sum, p) => sum + p.nightlyRate * 30, 0);

  const avgNightlyRate =
    properties.length > 0
      ? Math.round(properties.reduce((sum, p) => sum + p.nightlyRate, 0) / properties.length)
      : 0;

  const recentProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentVendors = [...vendors]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Welcome back! Here&apos;s an overview of your rental portfolio.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Properties"
          value={totalProperties}
          subtitle={`${availableProperties} available`}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          title="Currently Occupied"
          value={occupiedProperties}
          subtitle={`${maintenanceProperties} in maintenance`}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Active Vendors"
          value={activeVendors}
          subtitle={`of ${totalVendors} total vendors`}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Est. Monthly Revenue"
          value={`$${totalMonthlyRevenue.toLocaleString()}`}
          subtitle={`Avg. $${avgNightlyRate}/night`}
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Occupancy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Property Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Available', count: availableProperties, total: totalProperties, color: 'bg-green-500' },
              { label: 'Occupied', count: occupiedProperties, total: totalProperties, color: 'bg-blue-500' },
              { label: 'Maintenance', count: maintenanceProperties, total: totalProperties, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: totalProperties ? `${(item.count / totalProperties) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Recent Properties</h2>
            <Link
              href="/dashboard/properties"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{property.name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {property.city}, {property.state} · {property.bedrooms}bd/{property.bathrooms}ba
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-sm font-semibold text-slate-700">
                    ${property.nightlyRate}/night
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${propertyStatusColors[property.status]}`}
                  >
                    {capitalize(property.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Vendors */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Vendor Roster</h2>
          <Link
            href="/dashboard/vendors"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Manage vendors →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="border border-slate-200 rounded-lg p-3 hover:border-blue-200 hover:bg-blue-50/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                  {vendor.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{vendor.name}</p>
                  <p className="text-xs text-slate-400">{vendor.assignedPropertyIds.length} properties</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${vendorSpecialtyColors[vendor.specialty] ?? 'bg-slate-100 text-slate-600'}`}
                >
                  {capitalize(vendor.specialty)}
                </span>
                <span className="text-xs text-slate-500">⭐ {vendor.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
