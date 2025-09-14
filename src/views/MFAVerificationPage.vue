<template>
  <div class="mfa-verification-page">
    <div class="form-container">
      <h2 class="form-title">Verificación de Dos Factores</h2>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div class="mfa-info">
        <p>Ingresa el código de 6 dígitos de tu aplicación de autenticación.</p>
      </div>

      <form @submit.prevent="verifyMFA" class="mfa-form">
        <div class="form-group">
          <label for="mfaCode" class="form-label">Código de autenticación</label>
          <div class="mfa-code-input">
            <input type="text" id="mfaCode" v-model="mfaCode" class="form-input" required
              placeholder="Código de 6 dígitos" maxlength="6" pattern="[0-9]{6}" autofocus />
          </div>
          <div class="mfa-timer">
            <div class="timer-bar" :style="{ width: `${timerPercentage}%` }"></div>
          </div>
        </div>

        <button type="submit" class="btn btn-block" :disabled="!isFormValid">
          Verificar
        </button>
      </form>

      <div class="form-footer">
        <a href="#" @click.prevent="cancelLogin">Cancelar y volver al inicio de sesión</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const mfaCode = ref('')
const errorMessage = ref('')
const timerPercentage = ref(100)
const timerInterval = ref(null)

const email = localStorage.getItem('email')
const session = localStorage.getItem('session')

// Redirigir si falta información
if (!email || !session) {
  router.push('/login')
}

// Initialize timer here to avoid conditional hook call
startTimer()

const isFormValid = computed(() =>
  mfaCode.value.length === 6 && /^\d{6}$/.test(mfaCode.value)
)

const verifyMFA = async () => {
  if (!isFormValid.value) return

  try {
    const response = await axios.post('http://3.235.236.228:4000/auth/respond-challenge', {
      email,
      session,
      code: mfaCode.value
    })

    // Guardar token si el backend lo devuelve (ajusta esto a tu implementación)
    localStorage.setItem('token', response.data.accessToken)

    // Limpiar valores temporales
    localStorage.removeItem('session')
    localStorage.removeItem('email')

    // Redirigir al dashboard
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error al verificar el código MFA'
  }
}

const cancelLogin = () => {
  // Limpia el estado parcial
  localStorage.removeItem('session')
  localStorage.removeItem('email')
  router.push('/login')
}

function startTimer() {
  // Los códigos TOTP suelen durar 30 segundos
  const duration = 30
  const interval = 100
  let elapsed = 0

  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }

  timerInterval.value = setInterval(() => {
    elapsed += interval / 1000
    timerPercentage.value = Math.max(0, 100 - (elapsed / duration) * 100)

    if (elapsed >= duration) {
      clearInterval(timerInterval.value)
      // Reiniciar el temporizador
      setTimeout(() => {
        timerPercentage.value = 100
        startTimer()
      }, 100)
    }
  }, interval)
}

onMounted(() => {
  // startTimer() // Moved to top to avoid conditional hook call
})

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>

<style scoped>
.mfa-verification-page {
  padding: 2rem 0;
}

.mfa-info {
  text-align: center;
  margin-bottom: 2rem;
}

.mfa-code-input {
  display: flex;
  justify-content: center;
}

.mfa-timer {
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
}

.timer-bar {
  height: 100%;
  background-color: var(--secondary-color);
  transition: width 0.1s linear;
}

.form-footer {
  margin-top: 2rem;
  text-align: center;
}

.form-footer a {
  color: var(--secondary-color);
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
