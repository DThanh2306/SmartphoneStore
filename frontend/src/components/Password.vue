<script setup>
import usersService from '@/services/users.service';
import { useUserStore } from '@/store/UserStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const oldPassword = ref('');
const newPassword = ref('');
const userStore = useUserStore();
const username = ref(userStore.user?.username || null);
const router = useRouter();

const handleChangePassword = async () => {
  try {
    if (oldPassword.value == '' || newPassword.value == ''){ 
        alert('Vui lòng nhập đầy đủ thông tin')
    }  else {
    const response = await usersService.changePassword(username.value,oldPassword.value, newPassword.value);
    console.log('Password changed successfully:', response);
    alert('Thay đổi mật khẩu thành công!');
    router.push('/');
    }
   

  } catch (error) {
    alert('Thông tin nhập vào không đúng!')
    console.error('Failed to change password:', error);
    // Xử lý lỗi (hiển thị thông báo lỗi cho người dùng)
  }
};
</script>
<template>
    <div class="container bootstrap snippets bootdey ">
    <div class="d-flex align-items-center justify-content-center">
        <div class="col-xs-12 col-sm-12 col-md-6 col-md-offset-2">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        <span class="glyphicon glyphicon-th"></span>
                        Change password   
                    </h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6 separator social-login-box"> <br>
                           <img alt="" class="img-thumbnail" src="https://bootdey.com/img/Content/avatar/avatar1.png">                        
                        </div>
                        <div style="margin-top:80px;" class="col-xs-6 col-sm-6 col-md-6 login-box">
                         <div class="form-group">
                            <div class="input-group">
                              <div class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></div>
                              <input class="form-control" v-model="oldPassword" type="password" placeholder="Current Password">
                            </div>
                          </div>
                          <div class="form-group">
                            <div class="input-group">
                              <div class="input-group-addon"><span class="glyphicon glyphicon-log-in"></span></div>
                              <input class="form-control" v-model="newPassword" type="password" placeholder="New Password">
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-6"></div>
                        <div class="col-xs-6 col-sm-6 col-md-6">
                            <button class="btn icon-btn-save btn-success" @click="handleChangePassword()" type="button">
                            <span class="btn-save-label"><i class="glyphicon glyphicon-floppy-disk"></i></span>Đổi mật khẩu</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<style>
body{
background:#eee;
}
.separator {
    border-right: 1px solid #dfdfe0; 
}
.icon-btn-save {
    padding-top: 0;
    padding-bottom: 0;
}
.input-group {
    margin-bottom:10px; 
}
.btn-save-label {
    position: relative;
    left: -12px;
    display: inline-block;
    padding: 6px 12px;
    background: rgba(0,0,0,0.15);
    border-radius: 3px 0 0 3px;
}
</style>