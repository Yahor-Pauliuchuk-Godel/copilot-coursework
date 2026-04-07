import { useQuery } from '@tanstack/react-query';
import config from '../../config';

export interface Employee {
  id: number;
  name: string;
  dateOfBirth: string;
}

const fetchEmployees = async (): Promise<Employee[]> => {
  const res = await fetch(`${config.apiBaseUrl}/api/employees`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<Employee[]>;
};

export const useEmployees = () => {
  const { data, isLoading, error } = useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  return {
    employees: data ?? [],
    isLoading,
    error,
  };
};
