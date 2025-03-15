<script setup>
import { reactive, defineEmits } from 'vue';

const filters = reactive({
  price_min: 0,
  price_max: 50000000,
  brand: '',
  operating_system: '',
  ram: '',
  rom: ''
});

const emit = defineEmits(['applyFilter', 'cancelFilter']);

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function applyFilter() {
  emit('applyFilter', filters); // Gửi bộ lọc về component cha
}

function cancelFilter() {
  emit('cancelFilter', filters); // Gửi bộ lọc về component cha
}

function handlePriceChange(type, value) {
  if (type === 'min') {
    filters.price_min = Math.min(value, filters.price_max); // Đảm bảo min <= max
  } else if (type === 'max') {
    filters.price_max = Math.max(value, filters.price_min); // Đảm bảo max >= min
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <!-- Filter Component -->
      <div class="card filter-card">
        <div class="card-header text-center">
          <h5>Lọc sản phẩm</h5>
        </div>
        <div class="card-body p-1">
          <!-- Hãng Filter -->
          <div class="mb-3">
            <label for="brand" class="form-label"><b>Hãng</b></label>
            <select v-model="filters.brand" class="form-select form-select-sm" id="brand">
              <option value="">Tất cả các hãng</option>
              <option value="Samsung">Samsung</option>
              <option value="Google">Google</option>
              <option value="Apple">Apple</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Oppo">Oppo</option>
              <option value="Realme">Realme</option>
            </select>
          </div>

          <!-- Giá Filter -->
          <div class="mb-3">
            <div class="price-value text-center mt-2">
              <label for="priceMinRange" class="form-label"><b>Giá tối thiểu</b></label>
              <input
                type="range"
                class="form-range"
                id="priceMinRange"
                min="0"
                max="50000000"
                step="100000"
                :value="filters.price_min"
                @input="handlePriceChange('min', $event.target.value)"
              />
            </div>
            <div class="price-value text-center">
              <label for="priceMaxRange" class="form-label"><b>Giá tối đa</b></label>
              <input
                type="range"
                class="form-range"
                id="priceMaxRange"
                min="0"
                max="50000000"
                step="100000"
                :value="filters.price_max"
                @input="handlePriceChange('max', $event.target.value)"
              />
              <p>{{ formatPrice(filters.price_min) }} - {{ formatPrice(filters.price_max) }}</p>
            </div>
          </div>

          <!-- OS Filter -->
          <div class="mb-3">
            <label class="form-label"><b>Hệ điều hành</b></label>
            <div class="form-check">
              <input v-model="filters.operating_system" class="form-check-input" type="radio" name="os" id="osAndroid" value="Android" />
              <label class="form-check-label" for="osAndroid">Android</label>
            </div>
            <div class="form-check">
              <input v-model="filters.operating_system" class="form-check-input" type="radio" name="os" id="osIOS" value="iOS" />
              <label class="form-check-label" for="osIOS">iOS</label>
            </div>
          </div>

          <!-- RAM & ROM Filter -->
          <div class="d-flex justify-content-around">
            <div class="mb-3 me-4">
              <label class="form-label"><b>RAM</b></label>
              <div
                class="form-check"
                v-for="ramOption in ['4GB', '6GB', '8GB', '12GB']"
                :key="ramOption"
              >
                <input
                  type="radio"
                  class="form-check-input"
                  :value="ramOption"
                  v-model="filters.ram"
                />
                <label class="form-check-label">{{ ramOption }}</label>
              </div>
            </div>

            <div class="mb-3 ms-4">
              <label class="form-label"><b>ROM</b></label>
              <div
                class="form-check"
                v-for="romOption in ['64GB', '128GB', '256GB', '512GB']"
                :key="romOption"
              >
                <input
                  type="radio"
                  class="form-check-input"
                  :value="romOption"
                  v-model="filters.rom"
                />
                <label class="form-check-label">{{ romOption }}</label>
              </div>
            </div>
          </div>

          <!-- Apply Filter Button -->
          <button
            @click="applyFilter"
            class="btn btn-primary btn-sm w-100 apply-button"
          >
            Áp dụng
          </button>
          <button
            @click="cancelFilter"
            class="btn btn-secondary btn-sm w-100 apply-button mt-2"
          >
            Hủy bộ lọc
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 300px;
}
.filter-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  padding: 15px;
}
.filter-card h5 {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}
</style>