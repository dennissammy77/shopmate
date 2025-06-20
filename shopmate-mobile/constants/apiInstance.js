//export const postData = async (url,body,token,) => {
//    console.log('fired up')
//    try {
//        const response = await fetch(url, {
//            method: 'POST',
//            headers: {
//              'Content-Type': 'application/json',
//              'Authorization': `Bearer ${token?.current}`
//            },
//            body: JSON.stringify(body),
//        });
//        const result = await response.json();
//        console.log('post hook response',result)
//
//        if (!response?.ok) {
//            console.log(`An error has occurred: ${response?.status},${result?.error}`);
//        }
//        return ({result, status: response?.ok});
//    } catch (err) {
//        console.log('post hook Error',err)
//    }
//};
//
//export const putData = async (url,body,token,) => {
//    try {
//        const response = await fetch(url, {
//            method: 'PUT',
//            headers: {
//              'Content-Type': 'application/json',
//              'Authorization': `Bearer ${token.current}`
//            },
//            body: JSON.stringify(body),
//        });
//        const result = await response.json();
//        console.log('put hook response',result)
//
//        if (!response.ok) {
//            console.log(`An error has occurred: ${response.status},${result?.error}`);
//        }
//        return ({result, status: response.ok});
//    } catch (err) {
//        console.log('put hook Error',err)
//    }
//};
//
//export const patchData = async (url,body,token,) => {
//    try {
//        const response = await fetch(url, {
//            method: 'PATCH',
//            headers: {
//              'Content-Type': 'application/json',
//              'Authorization': `Bearer ${token.current}`
//            },
//            body: JSON.stringify(body),
//        });
//        const result = await response.json();
//        console.log('patch hook response',result)
//
//        if (!response.ok) {
//            console.log(`An error has occurred: ${response.status},${result?.error}`);
//        }
//        return ({result, status: response.ok});
//    } catch (err) {
//        console.log('patch hook Error',err)
//    }
//};
//
//export const fetchData = async (url,token,) => {
//    try {
//        const response = await fetch(url, {
//            method: 'GET',
//            headers: {
//              'Content-Type': 'application/json',
//              'Authorization': `Bearer ${token.current}`
//            },
//        });
//        const result = await response.json();
//        console.log('fetch hook response',result)
//
//        if (!response.ok) {
//            console.log(`An error has occurred: ${response.status},${result?.error}`);
//        }
//        return ({result, status: response.ok});
//    } catch (err) {
//        console.log('fetch hook Error',err)
//    }
//};
//
//export const deleteData = async (url,token,) => {
//    try {
//        const response = await fetch(url, {
//            method: 'DELETE',
//            headers: {
//              'Content-Type': 'application/json',
//              'Authorization': `Bearer ${token?.current}`
//            },
//        });
//        const result = await response.json();
//        console.log('delete hook response',result)
//
//        if (!response.ok) {
//            console.log(`An error has occurred: ${response.status},${result?.error}`);
//        }
//        return ({result, status: response.ok});
//    } catch (err) {
//        console.log('delete hook Error',err)
//    }
//};
//
import axios from 'axios';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token?.current}`,
});

export const postData = async (url, body, token) => {
  console.log('fired up');
  try {
    const response = await axios.post(url, body, {
      headers: getHeaders(token),
    });
    console.log('post hook response', response.data);
    return { result: response.data, status: true };
  } catch (err) {
    console.log('post hook Error', err.response?.status, err.response?.data?.error);
    return { result: err.response?.data, status: false };
  }
};

export const putData = async (url, body, token) => {
  try {
    const response = await axios.put(url, body, {
      headers: getHeaders(token),
    });
    console.log('put hook response', response.data);
    return { result: response.data, status: true };
  } catch (err) {
    console.log('put hook Error', err.response?.status, err.response?.data?.error);
    return { result: err.response?.data, status: false };
  }
};

export const patchData = async (url, body, token) => {
  try {
    const response = await axios.patch(url, body, {
      headers: getHeaders(token),
    });
    console.log('patch hook response', response.data);
    return { result: response.data, status: true };
  } catch (err) {
    console.log('patch hook Error', err.response?.status, err.response?.data?.error);
    return { result: err.response?.data, status: false };
  }
};

export const fetchData = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: getHeaders(token),
    });
    console.log('fetch hook response', response.data);
    return { result: response.data, status: true };
  } catch (err) {
    console.log('fetch hook Error', err.response?.status, err.response?.data?.error);
    return { result: err.response?.data, status: false };
  }
};

export const deleteData = async (url, token) => {
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(token),
    });
    console.log('delete hook response', response.data);
    return { result: response.data, status: true };
  } catch (err) {
    console.log('delete hook Error', err.response?.status, err.response?.data?.error);
    return { result: err.response?.data, status: false };
  }
};
