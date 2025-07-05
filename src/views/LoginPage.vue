<template>
  <div class="login-page">
    <div class="form-container">
      <h2 class="form-title">Iniciar Sesión</h2>
      
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            class="form-input" 
            required
            placeholder="ejemplo@correo.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            class="form-input" 
            required
            placeholder="Ingresa tu contraseña"
          />
          <div class="forgot-password">
            <router-link to="/forgot-password">¿Olvidaste tu contraseña?</router-link>
          </div>
        </div>
        
        <button type="submit" class="btn btn-block" :disabled="!isFormValid">
          Iniciar Sesión
        </button>
      </form>
      
      <div class="form-footer">
        ¿No tienes una cuenta? <router-link to="/register">Regístrate</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: ''
})

const isFormValid = computed(() => form.email && form.password)

const login = () => {
  if (!isFormValid.value) {
    return
  }
  
  // Aquí se implementará la lógica de login con AWS Cognito
  console.log('Iniciando sesión:', {
    email: form.email,
    password: '********' // No mostrar la contraseña en logs
  })
  
  // Simulación de login exitoso que requiere MFA
  router.push('/mfa-verification')
}
</script>

<style scoped>
.login-page {
  padding: 2rem 0;
}

.forgot-password {
  text-align: right;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.forgot-password a {
  color: var(--secondary-color);
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>
