async function efetch(url, options = {}) {
  try {
    const result = await fetch(url, options);
    const json = await result.json();

    if (!result.ok || json?.status !== 'success') {
      throw new Error(json.message || 'Phản hồi không thành công');
    }

    return json; // Trả về toàn bộ JSON để sử dụng đầy đủ dữ liệu
  } catch (error) {
    throw new Error(error.message);
  }
}

const userUrl = 'https://smartphonestore-backend.onrender.com/api/v1/user/filter';

async function filterUsers({
  u_acc,
  u_name,
  u_phone,
  u_add_street,
  u_add_district,
  u_add_city,
  u_add_province,
  searchQuery,
  page,
  pageSize,
} = {}) {
  const params = new URLSearchParams();

  if (u_acc) params.append('u_acc', u_acc);
  if (u_name) params.append('u_name', u_name);
  if (u_phone) params.append('u_phone', u_phone);
  if (u_add_street) params.append('u_add_street', u_add_street);
  if (u_add_district) params.append('u_add_district', u_add_district);
  if (u_add_city) params.append('u_add_city', u_add_city);
  if (u_add_province) params.append('u_add_province', u_add_province);
  if (searchQuery) params.append('searchQuery', searchQuery);

  params.append('page', page);
  params.append('pageSize', pageSize);

  const queryString = params.toString();
  const url = `${userUrl}?${queryString}`;
  return efetch(url, { method: 'GET' });
}

export function useUsersService() {
  const baseUrl = 'http://localhost:3000/api/v1/user';

  // Hàm đăng nhập
  async function login(userlogin) {
    return efetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userlogin),
    });
  }

  // Hàm lấy thông tin người dùng
  async function fetchUser(username) {
    const response = await efetch(`${baseUrl}/getUser/${username}`, {
      method: 'GET',
    });
    return response.user; // Trả về thông tin người dùng
  }

  // Hàm tạo người dùng mới
  async function createUser(user) {
    return efetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  }

  // Hàm đăng xuất
  async function logout() {
    return efetch(`${baseUrl}/logout`, {
      method: 'POST',
    });
  }

  // Hàm cập nhật thông tin người dùng
  async function updateUser(username, updatedData) {
    if (!username) {
      throw new Error('Username is required to update user information');
    }
  
    return efetch(`${baseUrl}/update/${username}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
  }  

  async function updateUserbyAdmin(u_acc, updatedData) {
    return efetch(`${baseUrl}/${u_acc}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
  }

  // Hàm thay đổi mật khẩu người dùng
  async function changePassword(username ,oldPassword, newPassword) {
    return efetch(`${baseUrl}/${username}/changePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  return {
    fetchUser,
    login,
    logout,
    updateUser,
    changePassword,
    createUser,
    filterUsers,
    updateUserbyAdmin,
  };
}

export default useUsersService();