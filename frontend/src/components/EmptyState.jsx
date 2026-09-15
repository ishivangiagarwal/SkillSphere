const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    {Icon && <Icon className="mb-4 h-14 w-14 text-gray-300 dark:text-gray-700" />}
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
