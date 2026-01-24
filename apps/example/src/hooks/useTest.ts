import { useState, useEffect } from 'react';

export function useTest() {
  const [value, setValue] = useState(null);

  useEffect(() => {
    // Add side effects here
  }, []);

  return { value, setValue };
}
