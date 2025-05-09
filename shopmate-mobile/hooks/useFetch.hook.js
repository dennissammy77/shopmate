import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchData = useCallback(async () => {
        // ////console.log(token)
        setLoading('loading...')
        setData(null);
        setError(null);

        fetch(url,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token.current}`
            },
        }).then((response) => response.json()).then((response) => {            
            setLoading(false);
            ////console.log('response data',response);
            return response && setData(response);
        })
        .catch(err => {
            ////console.log('response error',err);
            setLoading(false)
            setError('An error occurred.',err)
        })
      }, [url]);
  
    useEffect(() => {
        fetchData()
    }, [fetchData])
  
    return { data, loading, error, refetch: fetchData }
}
  
export default useFetch;