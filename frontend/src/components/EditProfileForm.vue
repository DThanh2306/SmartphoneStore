<script setup>
import { defineProps, reactive, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import usersService from '@/services/users.service';
import { useMutation } from '@tanstack/vue-query';
import { useUserStore } from '@/store/UserStore';

const router = useRouter();
const userStore = useUserStore();

// Nhận dữ liệu từ `props` và log để kiểm tra
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
console.log('Received props.user:', props.user);

const editableUser = reactive({ ...props.user });
const username = ref(userStore.user?.username || null);
console.log('Editable user initialized:', editableUser);

// Theo dõi thay đổi của `editableUser`
watch(
  () => editableUser,
  (newValue) => {
    console.log('Editable user updated:', newValue);
  },
  { deep: true }
);

// Sử dụng mutation để cập nhật thông tin người dùng
const updateUserMutation = useMutation({
  mutationFn: (userData) => {
    console.log('Sending data to update:', userData);
    return usersService.updateUser(username.value, userData);
  },
  onSuccess: () => {
    alert('Cập nhật thông tin thành công');
    console.log('Update success:', editableUser);
    router.push('/profile');
  },
  onError: (error) => {
    console.error('Error during update:', error);
    alert('Đã xảy ra lỗi khi cập nhật thông tin.');
  },
});

// Hàm gọi mutation để cập nhật thông tin
function updateInfor() {
  console.log('Attempting to update user:', editableUser);

  if (
    !editableUser.u_name ||
    !editableUser.u_phone ||
    !editableUser.u_add_street ||
    !editableUser.u_add_district ||
    !editableUser.u_add_city ||
    !editableUser.u_add_province
  ) {
    alert('Vui lòng điền đầy đủ tất cả các trường.');
    console.warn('Missing required fields:', editableUser);
    return;
  }

  // Gọi mutation để cập nhật thông tin người dùng
  updateUserMutation.mutate(editableUser);
}
</script>

<template>
  <div class="container bootstrap snippets bootdey">
    <div class="d-flex align-items-center justify-content-center">
      <div class="col-xs-12 col-sm-12 col-md-6 col-md-offset-2">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title">
              <span class="glyphicon glyphicon-th"></span>
              Cập Nhật Thông Tin
            </h3>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-xs-6 col-sm-6 col-md-6 separator social-login-box">
                <br />
                <img
                  alt=""
                  class="img-thumbnail"
                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                />
              </div>
              <div style="margin-top:80px;" class="col-xs-6 col-sm-6 col-md-6 login-box">
                <div class="form-group">
                  <div>Tên</div>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <span class="glyphicon glyphicon-lock"></span>
                    </div>
                    <input class="form-control" v-model="editableUser.u_name" />
                  </div>
                </div>
                <div class="form-group">
                  <div>Số Điện Thoại</div>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <span class="glyphicon glyphicon-log-in"></span>
                    </div>
                    <input
                      class="form-control"
                      v-model="editableUser.u_phone"
                      placeholder="Nhập Số Điện Thoại"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <div>Địa chỉ</div>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <span class="glyphicon glyphicon-lock"></span>
                    </div>
                    <input class="form-control" v-model="editableUser.u_add_street" />
                  </div>
                </div>
                <div class="form-group">
                  <div>Phường/Xã</div>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <span class="glyphicon glyphicon-lock"></span>
                    </div>
                    <input class="form-control" v-model="editableUser.u_add_district" />
                  </div>
                </div>
                <div class="form-group">
                  <div>Quận/Huyện</div>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <span class="glyphicon glyphicon-lock"></span>
                    </div>
                    <input class="form-control" v-model="editableUser.u_add_city" />
                  </div>
                </div>
                <div class="form-group">
                  <div>Tỉnh</div>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <span class="glyphicon glyphicon-lock"></span>
                    </div>
                    <input class="form-control" v-model="editableUser.u_add_province" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-footer">
            <div class="row">
              <div class="col-xs-6 col-sm-6 col-md-6"></div>
              <div class="col-xs-6 col-sm-6 col-md-6">
                <button class="btn btn-primary" type="button" @click="updateInfor()">
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Styles giữ nguyên */
.separator {
  border-right: 1px solid #dfdfe0;
}
.icon-btn-save {
  padding-top: 0;
  padding-bottom: 0;
}
.input-group {
  margin-bottom: 10px;
}
.btn-save-label {
  position: relative;
  left: -12px;
  display: inline-block;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px 0 0 3px;
}
</style>