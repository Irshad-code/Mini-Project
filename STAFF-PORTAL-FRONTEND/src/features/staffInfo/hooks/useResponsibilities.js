import { useEffect, useState } from 'react';
import { responsibilitiesService } from '../api/responsibilities.service';

export function useResponsibilities(userId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await responsibilitiesService.getUserResponsibilities(userId);
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const updateData = async (newData) => {
    if (!userId) return { success: false, error: 'No user ID provided' };

    try {
      setIsLoading(true);
      const response = await responsibilitiesService.upsertResponsibilities(
        userId,
        newData.responsibilities
      );

      if (response.success) {
        setData(response.data);
      }

      return response;
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    error,
    isLoading,
    updateData,
  };
}
