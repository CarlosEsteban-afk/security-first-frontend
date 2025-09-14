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
          <input type="email" id="email" v-model="form.email" class="form-input" required
            placeholder="ejemplo@correo.com" />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" id="password" v-model="form.password" class="form-input" required
            placeholder="Ingresa tu contraseña" />
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
import axios from 'axios'

const router = useRouter()
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: ''
})

const isFormValid = computed(() => form.email && form.password)

const login = async () => {
  if (!isFormValid.value) return

  try {
    const response = await axios.post('http://3.235.236.228:4000/auth/login', {
      email: form.email,
      password: form.password
    })
    if (response.data.challenge === 'MFA_SETUP') {
      localStorage.setItem('session', response.data.session)
      localStorage.setItem('email', form.email)

      router.push('/setup-mfa')
    } else if (response.data.challenge === 'MFA_REQUIRED') {
      localStorage.setItem('session', response.data.session)
      localStorage.setItem('email', form.email)
      router.push('/mfa-verification')
    } else {
      localStorage.setItem('token', response.data.accessToken)
      router.push('/dashboard')
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error al iniciar sesión'
  }
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
