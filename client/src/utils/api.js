import axios from 'axios';

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(`http://localhost:5000${url}`);
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const postData = async (url, formData) => {
    try {
        const response = await axios.post(`http://localhost:5000${url}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Required for file upload
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; 
    }
};


export const editData = async (url, updatedData) => {
    try {
        const response = await axios.put('http://localhost:5000' + url, updatedData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const deleteData = async (url) => {
    try {
        const response = await axios.delete(`http://localhost:5000${url}`);
        console.log('Delete response:', response.data);  // Log the response data
        return response.data;
    } catch (error) {
        console.error('Delete request error:', error.response || error.message);
        throw error;
    }
};

export const deleteImages = async (url, image) => {
    const { res } = await axios.delete('http://localhost:5000' + url, image);
    return res;
}