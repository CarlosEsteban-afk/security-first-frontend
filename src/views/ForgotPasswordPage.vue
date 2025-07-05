<template>
  <div class="forgot-password-page">
    <div class="form-container">
      <h2 class="form-title">Recuperar Contraseña</h2>
      
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <!-- Paso 1: Solicitar código de recuperación -->
      <div v-if="step === 1">
        <p class="form-description">
          Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
        </p>
        
        <form @submit.prevent="requestCode" class="forgot-password-form">
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
          
          <button type="submit" class="btn btn-block" :disabled="!form.email">
            Enviar código
          </button>
        </form>
      </div>
      
      <!-- Paso 2: Ingresar código y nueva contraseña -->
      <div v-if="step === 2">
        <p class="form-description">
          Hemos enviado un código de verificación a tu correo electrónico. 
          Ingresa el código y tu nueva contraseña.
        </p>
        
        <form @submit.prevent="resetPassword" class="reset-password-form">
          <div class="form-group">
            <label for="code" class="form-label">Código de verificación</label>
            <input 
              type="text" 
              id="code" 
              v-model="form.code" 
              class="form-input" 
              required
              placeholder="Código de 6 dígitos"
              maxlength="6"
              pattern="[0-9]{6}"
            />
          </div>
          
          <div class="form-group">
            <label for="newPassword" class="form-label">Nueva contraseña</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="form.newPassword" 
              class="form-input" 
              required
              placeholder="Mínimo 8 caracteres"
            />
            <div class="password-requirements">
              <p>La contraseña debe contener:</p>
              <ul>
                <li :class="{ valid: passwordHasMinLength }">Al menos 8 caracteres</li>
                <li :class="{ valid: passwordHasUppercase }">Al menos una mayúscula</li>
                <li :class="{ valid: passwordHasLowercase }">Al menos una minúscula</li>
                <li :class="{ valid: passwordHasNumber }">Al menos un número</li>
                <li :class="{ valid: passwordHasSpecial }">Al menos un carácter especial</li>
              </ul>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="form.confirmPassword" 
              class="form-input" 
              required
              placeholder="Repite tu nueva contraseña"
            />
            <div v-if="passwordMismatch" class="password-mismatch">
              Las contraseñas no coinciden
            </div>
          </div>
          
          <button type="submit" class="btn btn-block" :disabled="!isFormValid">
            Restablecer contraseña
          </button>
        </form>
        
        <div class="resend-code">
          <p>¿No recibiste el código?</p>
          <button @click="requestCode" class="btn-link" :disabled="resendDisabled">
            {{ resendDisabled ? `Reenviar código (${resendCountdown}s)` : 'Reenviar código' }}
          </button>
        </div>
      </div>
      
      <div class="form-footer">
        <router-link to="/login">Volver a iniciar sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const errorMessage = ref('')
const successMessage = ref('')
const resendDisabled = ref(false)
const resendCountdown = ref(0)
const resendTimer = ref(null)
const step = ref(1) // Initialize step here

const form = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordHasMinLength = computed(() => form.newPassword.length >= 8)
const passwordHasUppercase = computed(() => /[A-Z]/.test(form.newPassword))
const passwordHasLowercase = computed(() => /[a-z]/.test(form.newPassword))
const passwordHasNumber = computed(() => /[0-9]/.test(form.newPassword))
const passwordHasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword))
const passwordMismatch = computed(() => form.confirmPassword && form.newPassword !== form.confirmPassword)

const isFormValid = computed(() => 
  form.code &&
  form.code.length === 6 &&
  passwordHasMinLength.value &&
  passwordHasUppercase.value &&
  passwordHasLowercase.value &&
  passwordHasNumber.value &&
  passwordHasSpecial.value &&
  form.newPassword === form.confirmPassword
)

const requestCode = () => {
  if (!form.email) {
    errorMessage.value = 'Por favor, ingresa tu correo electrónico'
    return
  }
  
  // Aquí se implementará la lógica para solicitar el código con AWS Cognito
  console.log('Solicitando código para:', form.email)
  
  // Avanzar al paso 2
  step.value = 2
  successMessage.value = 'Se ha enviado un código a tu correo electrónico'
  
  // Configurar el temporizador para reenvío
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

const resetPassword = () => {
  if (!isFormValid.value) {
    return
  }
  
  // Aquí se implementará la lógica para restablecer la contraseña con AWS Cognito
  console.log('Restableciendo contraseña con código:', form.code)
  
  // Simulación de restablecimiento exitoso
  successMessage.value = 'Contraseña restablecida correctamente'
  
  // Redirigir al login después de un breve retraso
  setTimeout(() => {
    router.push('/login')
  }, 2000)
}

onBeforeUnmount(() => {
  if (resendTimer.value) {
    clearInterval(resendTimer.value)
  }
})
</script>

<style scoped>
.forgot-password-page {
  padding: 2rem 0;
}

.form-description {
  margin-bottom: 1.5rem;
  text-align: center;
}

.password-requirements {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.password-requirements ul {
  list-style-type: none;
  padding-left: 0.5rem;
  margin-top: 0.25rem;
}

.password-requirements li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.25rem;
}

.password-requirements li:before {
  content: "✕";
  position: absolute;
  left: 0;
  color: #dc3545;
}

.password-requirements li.valid:before {
  content: "✓";
  color: #28a745;
}

.password-mismatch {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.resend-code {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.btn-link {
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  padding: 0;
  margin: 0;
}

.btn-link:disabled {
  color: #999;
  cursor: not-allowed;
  text-decoration: none;
}
</style>
