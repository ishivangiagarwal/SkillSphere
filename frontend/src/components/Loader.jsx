const Loader = ({ full = false, size = 'md' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const spinner = (
    <div className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`} />
  );
  if (full) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        {spinner}
      </div>
    );
  }
  return <div className="flex items-center justify-center py-6">{spinner}</div>;
};

export default Loader;
