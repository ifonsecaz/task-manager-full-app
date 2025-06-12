import axios from 'axios';

const apiInstance = axios.create({
    baseURL: `http://localhost:8080/api`,
    withCredentials: true
  });


export const fetchData = async (uri) => {
    try{
    const response = await apiInstance.get(uri);
    console.log(response);
    return response;
    }
    catch(error){
        if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.status, error.response?.data);
        return {
            status: error.response?.status || 500,
            data: error.response?.data || { message: "Unknown error" },
            error: true
        };
        } else {
        console.error("Unknown error:", error);
        return { status: 500, data: { message: "Unknown error" }, error: true };
        }
    }
};

export const fetchDataAuth = async (uri, firstTry) => { 
    const token=sessionStorage.getItem('accessToken');
    if(token){
        try{
            const response = await apiInstance.get(uri, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                } 
            });
            return response;
        }
        catch(error){
            if (error.response.status === 403 && firstTry) {
                try {
                    const res = await apiInstance.post('/auth/refresh');
                    sessionStorage.setItem('accessToken', res.data);
                    return fetchDataAuth(uri,false);
                } catch (refreshError) {
                    // redirect to login or show error
                }
            }
            else{
                if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.status, error.response?.data);
                return {
                    status: error.response?.status || 500,
                    data: error.response?.data || { message: "Unknown error" },
                    error: true
                };
                } else {
                    console.error("Unknown error:", error);
                    return { status: 500, data: { message: "Unknown error" }, error: true };
                }
            }
        }

    }    
};
    
export const postData = async (uri, body) => {
    try{
    const response = await apiInstance.post(uri, body, {
        headers: {
            'Content-Type': 'application/json',
        },        
    });
        console.log(response);

    return response;
    }
    catch(error){
        if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.status, error.response?.data);
        return {
            status: error.response?.status || 500,
            data: error.response?.data || { message: "Unknown error" },
            error: true
        };
        } else {
        console.error("Unknown error:", error);
        return { status: 500, data: { message: "Unknown error" }, error: true };
        }
    }
};

export const postDataAuth = async (uri, body, firstTry) => {
    const token=sessionStorage.getItem('accessToken');
    if(token){
        try{
            const response = await apiInstance.post(uri,body, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                } 
            });
            return response;
        }
        catch(error){
            if (error.response.status === 403 && firstTry) {
                try {
                    const res = await apiInstance.post('/auth/refresh');
                    sessionStorage.setItem('accessToken', res.data);
                    return postDataAuth(uri,body,false);
                } catch (refreshError) {
                    // redirect to login or show error
                }
            }
            else{
                if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.status, error.response?.data);
                return {
                    status: error.response?.status || 500,
                    data: error.response?.data || { message: "Unknown error" },
                    error: true
                };
                } else {
                    console.error("Unknown error:", error);
                    return { status: 500, data: { message: "Unknown error" }, error: true };
                }
            }
        }

    }    
};


export const putData = async (uri, body,firstTry) => {
    const token=sessionStorage.getItem('accessToken');
    if(token){
        try{
            const response = await apiInstance.put(uri,body, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                } 
            });
            return response;
        }
        catch(error){
            if (error.response.status === 403 && firstTry) {
                try {
                    const res = await apiInstance.post('/auth/refresh');
                    sessionStorage.setItem('accessToken', res.data);
                    return putData(uri,body,false);
                } catch (refreshError) {
                    // redirect to login or show error
                }
            }
            else{
                if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.status, error.response?.data);
                return {
                    status: error.response?.status || 500,
                    data: error.response?.data || { message: "Unknown error" },
                    error: true
                };
                } else {
                    console.error("Unknown error:", error);
                    return { status: 500, data: { message: "Unknown error" }, error: true };
                }
            }
        }

    } 
};


export const deleteData = async (uri, firstTry) => {
    const token=sessionStorage.getItem('accessToken');
    console.log(uri);
    if(token){
        try{
            const response = await apiInstance.delete(uri, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                } 
            });
            console.log(response);
            return response;
        }
        catch(error){
            console.log(error);
            if (error.response.status === 403 && firstTry) {
                try {
                    const res = await apiInstance.post('/auth/refresh');
                    sessionStorage.setItem('accessToken', res.data);
                    return deleteData(uri,false);
                } catch (refreshError) {
                    // redirect to login or show error
                }
            }
            else{
                if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.status, error.response?.data);
                return {
                    status: error.response?.status || 500,
                    data: error.response?.data || { message: "Unknown error" },
                    error: true
                };
                } else {
                    console.error("Unknown error:", error);
                    return { status: 500, data: { message: "Unknown error" }, error: true };
                }
            }
        }

    } 
};