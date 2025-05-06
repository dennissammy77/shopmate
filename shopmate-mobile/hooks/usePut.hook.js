import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const usePut = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();


    const putData = useCallback(async (body) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token.current}`
                },
                body: JSON.stringify(body),
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
    }, [url]);

    return { data, loading, error, putData };
};

export default usePut;