<template>
  <div class="register-page">
    <div class="form-container">
      <h2 class="form-title">Crear una cuenta</h2>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="register" class="register-form">
        <div class="form-group">
          <label for="name" class="form-label">Nombre completo</label>
          <input type="text" id="name" v-model="form.name" class="form-input" required
            placeholder="Ingresa tu nombre completo" />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <input type="email" id="email" v-model="form.email" class="form-input" required
            placeholder="ejemplo@correo.com" />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" id="password" v-model="form.password" class="form-input" required
            placeholder="Mínimo 8 caracteres" />
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
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" class="form-input" required
            placeholder="Repite tu contraseña" />
          <div v-if="passwordMismatch" class="password-mismatch">
            Las contraseñas no coinciden
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="form.termsAccepted" required />
            <span class="checkmark"></span>
            Acepto los <a href="#" @click.prevent="showTerms">términos y condiciones</a>
          </label>
        </div>

        <button type="submit" class="btn btn-block" :disabled="!isFormValid">
          Registrarse
        </button>
      </form>

      <div class="form-footer">
        ¿Ya tienes una cuenta? <router-link to="/login">Iniciar sesión</router-link>
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false
})

const passwordHasMinLength = computed(() => form.password.length >= 8)
const passwordHasUppercase = computed(() => /[A-Z]/.test(form.password))
const passwordHasLowercase = computed(() => /[a-z]/.test(form.password))
const passwordHasNumber = computed(() => /[0-9]/.test(form.password))
const passwordHasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.password))
const passwordMismatch = computed(() => form.confirmPassword && form.password !== form.confirmPassword)

const isFormValid = computed(() =>
  form.name &&
  form.email &&
  passwordHasMinLength.value &&
  passwordHasUppercase.value &&
  passwordHasLowercase.value &&
  passwordHasNumber.value &&
  passwordHasSpecial.value &&
  form.password === form.confirmPassword &&
  form.termsAccepted
)

const register = async () => {
  if (!isFormValid.value) return

  try {
    const res = await axios.post('http://3.235.236.228:4000/auth/signup', {
      name: form.name,
      email: form.email,
      password: form.password
    })
    console.log(res.data);
    if (res.data.success) {
      localStorage.setItem('email', form.email)
      router.push('/verify-email')
    } else {
      errorMessage.value = res.data.message || 'Error al registrar la cuenta'
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Error al registrar la cuenta'
  }
}


const showTerms = () => {
  alert('Términos y condiciones del servicio')
}
</script>

<style scoped>
.register-page {
  padding: 2rem 0;
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

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox-container input {
  margin-right: 0.5rem;
}

.checkbox-container a {
  color: var(--secondary-color);
  text-decoration: none;
}

.checkbox-container a:hover {
  text-decoration: underline;
}
</style>
