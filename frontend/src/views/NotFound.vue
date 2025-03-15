<template>
    <div class="notfound">
      <h1 class="notfound-title">404</h1>
      <p class="notfound-text">Oops! Trang bạn đang tìm kiếm không tồn tại.</p>
      <router-link to="/" class="notfound-button">Quay về trang chủ</router-link>
    </div>
  </template>
  
  <style>
  .notfound {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    background-color: #f8f9fa;
    color: #333;
  }
  
  .notfound-title {
    font-size: 6rem;
    font-weight: bold;
    color: #ff6b6b;
    margin-bottom: 20px;
  }
  
  .notfound-text {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
  
  .notfound-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .notfound-button:hover {
    background-color: #0056b3;
  }
  
  .notfound-image {
    margin-top: 20px;
    max-width: 100%;
    height: auto;
  }
  </style>