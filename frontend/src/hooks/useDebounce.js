import { useEffect, useState } from 'react';

// Debounces a rapidly-changing value (e.g. a search input) so dependent
// effects (like an API call) only fire after the user stops typing.
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
