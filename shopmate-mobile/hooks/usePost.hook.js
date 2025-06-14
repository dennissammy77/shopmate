import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const usePost = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();    

    const postData = useCallback(async (body) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token?.current}`
                },
                body: JSON.stringify(body),
            });
            const result = await response.json();
            console.log('post hook response',response)

            if (!response.ok) {
                setError(result?.error);
                throw new Error(`An error has occurred: ${response.status}`);
            }

            setData(result);
            return result;
        } catch (err) {
            console.log('post hook Error',err)
//            setError(err);
        } finally {
            setLoading(false);
        }
    }, [url]);


    return { data, loading, error, postData };
};

export default usePost;