import { useQuery } from '@tanstack/react-query';
import config from '../config';
import type { Employee } from './useEmployees';

const fetchEmployee = async (id: number): Promise<Employee> => {
  const res = await fetch(`${config.apiBaseUrl}/api/employees/${id}`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<Employee>;
};

export const useEmployee = (id: number) => {
  const { data, isLoading, error } = useQuery<Employee, Error>({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id),
  });

  return {
    employee: data,
    isLoading,
    error,
  };
};
