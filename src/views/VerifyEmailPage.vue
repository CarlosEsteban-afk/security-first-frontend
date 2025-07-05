<template>
  <div class="verify-email-page">
    <div class="form-container">
      <h2 class="form-title">Verificar Correo Electrónico</h2>
      
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <div class="verification-info">
        <p>Hemos enviado un código de verificación a tu correo electrónico:</p>
        <p class="email-address">{{ email }}</p>
        <p>Por favor, ingresa el código para verificar tu cuenta.</p>
      </div>
      
      <form @submit.prevent="verifyEmail" class="verification-form">
        <div class="form-group">
          <label for="verificationCode" class="form-label">Código de verificación</label>
          <div class="verification-code-input">
            <input 
              type="text" 
              v-model="verificationCode" 
              class="form-input" 
              required
              placeholder="Ingresa el código de 6 dígitos"
              maxlength="6"
              pattern="[0-9]{6}"
            />
          </div>
        </div>
        
        <button type="submit" class="btn btn-block" :disabled="!isFormValid">
          Verificar
        </button>
      </form>
      
      <div class="resend-code">
        <p>¿No recibiste el código?</p>
        <button @click="resendCode" class="btn-link" :disabled="resendDisabled">
          {{ resendDisabled ? `Reenviar código (${resendCountdown}s)` : 'Reenviar código' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('usuario@ejemplo.com') // Esto vendría de la página de registro
const verificationCode = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const resendDisabled = ref(false)
const resendCountdown = ref(0)
const resendTimer = ref(null)

const isFormValid = computed(() => 
  verificationCode.value.length === 6 && /^\d{6}$/.test(verificationCode.value)
)

const verifyEmail = () => {
  if (!isFormValid.value) {
    return
  }
  
  // Aquí se implementará la lógica de verificación con AWS Cognito
  console.log('Verificando código:', verificationCode.value)
  
  // Simulación de verificación exitosa
  successMessage.value = 'Correo electrónico verificado correctamente'
  
  // Redirigir a la configuración de MFA después de un breve retraso
  setTimeout(() => {
    router.push('/setup-mfa')
  }, 2000)
}

const resendCode = () => {
  if (resendDisabled.value) {
    return
  }
  
  // Aquí se implementará la lógica para reenviar el código con AWS Cognito
  console.log('Reenviando código de verificación')
  
  // Deshabilitar el botón de reenvío durante 60 segundos
  resendDisabled.value = true
  resendCountdown.value = 60
  
  resendTimer.value = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(resendTimer.value)
      resendDisabled.value = false
    }
  }, 1000)
}

onBeforeUnmount(() => {
  if (resendTimer.value) {
    clearInterval(resendTimer.value)
  }
})
</script>

<style scoped>
.verify-email-page {
  padding: 2rem 0;
}

.verification-info {
  text-align: center;
  margin-bottom: 2rem;
}

.email-address {
  font-weight: bold;
  margin: 0.5rem 0;
}

.verification-code-input {
  display: flex;
  justify-content: center;
}

.resend-code {
  margin-top: 2rem;
  text-align: center;
}

.btn-link {
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: 1rem;
  padding: 0;
  margin: 0;
}

.btn-link:disabled {
  color: #999;
  cursor: not-allowed;
  text-decoration: none;
}
</style>
