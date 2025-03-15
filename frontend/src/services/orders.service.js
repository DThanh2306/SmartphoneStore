/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
async function efetch(url, options = {}) {
    try {
        const result = await fetch(url, {
            ...options,
            credentials: 'include', // Gửi cookie trong mọi request
        });
        const json = await result.json();

        // Kiểm tra nếu fetch không thành công
        if (!result.ok) {
            throw { status: result.status, message: json.message || result.statusText };
        }

        return json;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        throw error;
    }
}


const orderUrl = '/api/v1/orders';

function ordersService() {
    async function getAllOrders() {
        const url = `${orderUrl}`;
        return await efetch(url, { method: 'GET' });
    }
    
    async function createOrder(username) {
        const url = `${orderUrl}/${username}`;
        return efetch(url, {
            method: 'POST',    
        });
    }

    async function getOrdersByUserId(userId) {
        const url = `${orderUrl}/${userId}`;
        console.log(url);
        return efetch(url,{
            method:'GET'
        });
    }

    async function getOrderDetailsById(orderId) {
        const url =`${orderUrl}/details/${orderId}`;
        return efetch(url , {
            method: 'GET'
        })
    }
    return {
        getAllOrders,
        createOrder,
        getOrdersByUserId,
        getOrderDetailsById
    }
}

export default ordersService();