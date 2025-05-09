import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const useDelete = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();    

    const deleteData = useCallback(async (url) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token?.current}`
                },
            });
    
            if (!response.ok) {
                throw new Error(`An error has occurred: ${response.status}`);
            }
    
            const result = await response.json();
            setData(result);
            // toast.success("Created successfully!"); 
            return result;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, deleteData };
};

export default useDelete;