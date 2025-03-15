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
            throw new Error("Fetch error: " + result.statusText);
        }

        return json;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        throw new Error(error.message);
    }
}

const cartUrl = '/api/v1/cart';

function cartService() {
    // Thêm sản phẩm vào giỏ hàng
    async function addToCart(username ,productId) {
        const url = `${cartUrl}/${username}/${productId}`;
        return efetch(url, {
            method: 'POST'
        });
    }

    // Lấy giỏ hàng của người dùng theo `u_acc`
    async function getCartByUser(u_acc) {
        const url = `${cartUrl}/${u_acc}`;
        return efetch(url, {
            method: 'GET'
        });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async function removeProductFromCart(u_acc, productId) {
        const url = `${cartUrl}/${u_acc}/product/${productId}`;
        return efetch(url, {
            method: 'DELETE'
        });
    }
    async function decreaseQuantity(u_acc, productId) {
        const url = `${cartUrl}/${u_acc}/product/${productId}/decrease`;
        return efetch(url,{
            method: 'PUT'
        })
        
    }

    return {
        addToCart,
        getCartByUser,
        removeProductFromCart,
        decreaseQuantity
    };
}

export default cartService();
