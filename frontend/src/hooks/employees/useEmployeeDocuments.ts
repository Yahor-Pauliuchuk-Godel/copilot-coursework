import { useQuery } from '@tanstack/react-query';
import config from '../../config';

export interface EmployeeDocument {
  id: number;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

const fetchEmployeeDocuments = async (employeeId: number): Promise<EmployeeDocument[]> => {
  const res = await fetch(`${config.apiBaseUrl}/api/employees/${employeeId}/documents`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<EmployeeDocument[]>;
};

export const useEmployeeDocuments = (employeeId: number) => {
  const { data, isLoading, error } = useQuery<EmployeeDocument[], Error>({
    queryKey: ['employeeDocuments', employeeId],
    queryFn: () => fetchEmployeeDocuments(employeeId),
  });

  return {
    documents: data ?? [],
    isLoading,
    error,
  };
};
