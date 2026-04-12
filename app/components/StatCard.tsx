interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-amber-100 text-amber-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
};

export default function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
      </div>
    </div>
  );
}
