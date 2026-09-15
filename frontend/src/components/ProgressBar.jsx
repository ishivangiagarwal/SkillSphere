const ProgressBar = ({ value = 0, showLabel = true }) => (
  <div className="w-full">
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    {showLabel && <span className="mt-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{value}% complete</span>}
  </div>
);

export default ProgressBar;
