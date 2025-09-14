<template>
  <div class="setup-mfa-page">
    <div class="form-container">
      <h2 class="form-title">Configurar Autenticación de Dos Factores</h2>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div class="mfa-steps">
        <div class="step" :class="{ 'active': currentStep === 1 }">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Descarga una aplicación de autenticación</h3>
            <p>Descarga e instala una aplicación de autenticación como Google Authenticator o Authy en tu dispositivo
              móvil.</p>
            <div class="app-links">
              <a href="https://play.google.com/store/apps/details?id=com.google.android.apps/authenticator2"
                target="_blank" class="app-link">
                <img src="/src/assets/playstore.png" alt="Seguridad en la nube" />
                Google Play
              </a>
              <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank" class="app-link">
                <img src="/src/assets/appstore.ico" alt="Seguridad en la nube" />
                App Store
              </a>
            </div>
          </div>
        </div>

        <div class="step" :class="{ 'active': currentStep === 2 }">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Escanea el código QR</h3>
            <p>Abre la aplicación de autenticación y escanea el siguiente código QR:</p>

            <div class="qr-secret-container">
              <div class="qr-container">
                <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Código QR MFA" class="qr-code" />
                <p v-else>Cargando QR...</p>
              </div>
              <div class="secret-key">
                <p>O ingresa esta clave manualmente:</p>
                <div class="secret-key-value">{{ secretCode }}</div>
              </div>
            </div>

          </div>
        </div>

        <div class="step" :class="{ 'active': currentStep === 3 }">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Verifica la configuración</h3>
            <p>Ingresa el código de 6 dígitos que aparece en tu aplicación de autenticación:</p>
            <div class="verification-code-input">
              <input type="text" v-model="verificationCode" class="form-input" required
                placeholder="Código de 6 dígitos" maxlength="6" pattern="[0-9]{6}" />
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button v-if="currentStep > 1" @click="prevStep" class="btn btn-outline">
          Anterior
        </button>
        <button v-if="currentStep < 3" @click="nextStep" class="btn">
          Siguiente
        </button>
        <button v-if="currentStep === 3" @click="verifyAndComplete" class="btn" :disabled="!isVerificationCodeValid">
          Completar configuración
        </button>
      </div>

      <div class="skip-mfa">
        <p>¿Configurar más tarde?</p>
        <button @click="skipMFA" class="btn-link">
          Omitir por ahora (no recomendado)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import QRCode from 'qrcode'

const router = useRouter()
const currentStep = ref(1)
const verificationCode = ref('')
const errorMessage = ref('')
const secretCode = ref('')
const qrCodeUrl = ref('')
const session = ref(localStorage.getItem('session') || '')

const isVerificationCodeValid = computed(() =>
  verificationCode.value.length === 6 && /^\d{6}$/.test(verificationCode.value)
)

onMounted(async () => {
  if (!session.value) {
    router.push('/login')
    return
  }

  try {
    const res = await axios.post('http://3.235.236.228:4000/auth/setup-mfa', {
      session: session.value
    })

    console.log(res.data);


    secretCode.value = res.data.secretCode
    session.value = res.data.session
    localStorage.setItem('session', res.data.session)

    const email = localStorage.getItem('email')
    const issuer = 'SecurityFirst'
    const otpAuthUrl = `otpauth://totp/${issuer}:${email}?secret=${secretCode.value}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`

    qrCodeUrl.value = await QRCode.toDataURL(otpAuthUrl)

  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Error al generar el código TOTP'
  }
})

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const verifyAndComplete = async () => {
  try {
    const verifyRes = await axios.post('http://3.235.236.228:4000/auth/verify-mfa', {
      session: session.value,
      code: verificationCode.value
    })
    console.log("verifyRes.data", verifyRes.data);

    const enableRes = await axios.post('http://3.235.236.228:4000/auth/enable-mfa', {
      session: verifyRes.data.session
    })
    console.log("enableRes.data", enableRes.data);

    localStorage.setItem('token', enableRes.data.accessToken)
    localStorage.removeItem('session')
    localStorage.removeItem('email')

    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Código incorrecto. Inténtalo de nuevo.'
  }
}

const skipMFA = () => {
  const confirmed = confirm('¿Estás seguro de omitir la configuración de MFA? No es recomendable.')
  if (confirmed) router.push('/dashboard')
}

</script>

<style scoped>
.setup-mfa-page {
  padding: 2rem 0;
}

.mfa-steps {
  margin-bottom: 2rem;
}

.step {
  display: flex;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.step.active {
  opacity: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  object-fit: contain;
  overflow: auto;
}

.step-content h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.app-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.app-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--primary-color);
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
}

.app-link img {
  width: 24px;
  height: 24px;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
}

.qr-secret-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.qr-code {
  width: 200px;
  height: 200px;
  border: 1px solid #ddd;
}

.secret-key {
  text-align: center;
  margin-top: 1rem;
}

.secret-key-value {
  font-family: monospace;
  font-size: 1.2rem;
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  margin-top: 0.5rem;
}

.verification-code-input {
  margin-top: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.skip-mfa {
  margin-top: 2rem;
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.btn-outline {
  background-color: transparent;
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
}

.btn-outline:hover {
  background-color: var(--secondary-color);
  color: white;
}
</style>
