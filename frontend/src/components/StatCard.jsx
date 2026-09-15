const StatCard = ({ icon: Icon, label, value, color = 'primary', subtitle, onClick }) => {
  const colorMap = {
    primary: 'bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
    green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400',
    cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400',
  };

  return (
    <div
      onClick={onClick}
      className={`card flex items-center gap-4 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard p-5 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all' : ''
      }`}
    >
      <div className={`rounded-xl ${colorMap[color] || colorMap.primary} p-3`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value ?? '—'}</p>
        <p className="text-xs font-semibold text-gray-400">{label}</p>
        {subtitle && <p className="mt-0.5 text-[10px] text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;

