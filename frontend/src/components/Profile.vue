<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({
     user: {
        type: Object, 
        required: true 
    }, 
});
const router = useRouter();

function goToEditProfile(){
    router.push('/profile/edit');
}

</script>
<template>
    <div class="container" v-if="user">
    <div class="d-flex align-items-center justify-content-center">
        <div class="col-xl-5 col-lg-12 col-md-12 col-sm-12 layout-top-spacing ">
            <div class="user-profile">
                <div class="widget-content widget-content-area ">
                    <div class="d-flex justify-content-between">
                        <h3 class="">Thông Tin Người Dùng</h3>
                        <a href="javascript:void(0)" @click="goToEditProfile" class="mt-2 edit-profile"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></a>
                    </div>
                    <div class="text-center user-info">
                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar">
                        <p class="">{{ user.u_name }}</p>
                    </div>
                    <div class="user-info-list">

                        <div class="">
                            <ul class="contacts-block list-unstyled">
                                
                               
                                <li class="contacts-block__item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin me-3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {{ user.u_add_street }} , {{ user.u_add_district }}, {{ user.u_add_city }}, {{ user.u_add_province }}
                                </li>
                               
                                <li class="contacts-block__item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone me-3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> {{ user.u_phone }}
                                </li>
                            </ul>

                            <ul class="list-inline mt-4">
                                <li class="list-inline-item mb-0">
                                    <a class="btn btn-info btn-icon btn-rounded _effect--ripple waves-effect waves-light" href="javascript:void(0);">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                                    </a>
                                </li>
                                <li class="list-inline-item mb-0">
                                    <a class="btn btn-danger btn-icon btn-rounded _effect--ripple waves-effect waves-light" href="javascript:void(0);">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dribbble"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path></svg>
                                    </a>
                                </li>
                                <li class="list-inline-item mb-0">
                                    <a class="btn btn-dark btn-icon btn-rounded _effect--ripple waves-effect waves-light" href="javascript:void(0);">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                    </a>
                                </li>
                            </ul>
                        </div>                                    
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<style scoped>
.user-profile .widget-content-area {
    border-radius: 6px;
}
.widget-content-area {
    border: 1px solid #e0e6ed;
    box-shadow: 0 0 40px 0 rgba(94, 92, 154, 0.06);
}
.widget-content-area {
    padding: 20px;
    position: relative;
    background-color: #fff;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid #e0e6ed;
    border-top: none;
}
.user-profile .widget-content-area .user-info {
    margin-top: 40px;
}
.user-profile .widget-content-area .user-info p {
    font-size: 20px;
    font-weight: 600;
    margin-top: 22px;
    color: #009688;
}
.user-profile .widget-content-area .edit-profile {
    height: 35px;
    width: 35px;
    display: flex;
    justify-content: center;
    align-self: center;
    background-color: #4361ee;
    background: linear-gradient(to right, #3cba92 0%, #0ba360 100%);
    border-radius: 50%;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
}

.user-profile .widget-content-area .edit-profile svg {
    font-size: 17px;
    vertical-align: middle;
    margin-right: 0;
    color: #e0e6ed;
    width: 19px;
    align-self: center;
}

.btn svg {
    pointer-events: none;
    height: 22px;
    width: 22px;
    vertical-align: middle;
}
.btn.btn-icon.btn-rounded {
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    border-radius: 50%;
}
.btn-primary:hover {
  background-color: rgb(5, 106, 5);
}

.btn-primary {
  background-color: rgb(11, 153, 11);
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
}
.btn.btn-icon {
    padding: 7.5px 9px;
}
.user-profile .widget-content-area .user-info img {
    border-radius: 9px;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
}
.user-profile .widget-content-area .user-info-list > div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.user-profile .widget-content-area .user-info-list ul.contacts-block {
    border: none;
    max-width: 217px;
    margin: 30px 0 0 0;
}

.user-profile .widget-content-area .user-info-list ul.contacts-block li {
    margin-bottom: 13px;
    font-weight: 600;
    font-size: 13px;
}

.user-profile .widget-content-area .user-info-list ul.contacts-block li a:not(.btn) {
    font-weight: 600;
    font-size: 15px;
    color: #009688;
}
</style>