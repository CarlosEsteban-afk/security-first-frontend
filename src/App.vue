<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isAuthenticated = ref(false)

const checkAuth = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    isAuthenticated.value = false
    return
  }

  try {
    const res = await axios.get('http://3.235.236.228:4000/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(res.data);
    if (res.data.error) {
      throw new Error(res.data.error)
    }

    isAuthenticated.value = true
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Token inválido o expirado')
      localStorage.removeItem('token')
      isAuthenticated.value = false
      router.push('/login')
      return
    }

  }
}
const logout = () => {
  localStorage.removeItem('token')
  isAuthenticated.value = false
  router.push('/login')
}

onMounted(() => {
  checkAuth()
})
</script>


<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <div class="logo">
          <h1>SecureAuth</h1>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <router-link to="/login" class="nav-link" v-if="!isAuthenticated">Iniciar Sesión</router-link>
          <router-link to="/register" class="nav-link" v-if="!isAuthenticated">Registrarse</router-link>
          <a href="#" @click.prevent="logout" class="nav-link" v-if="isAuthenticated">Cerrar Sesión</a>
          <router-link to="/dashboard" class="nav-link" v-if="isAuthenticated">Dashboard</router-link>
        </nav>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 SecureAuth - Proyecto AWS Academy Cloud Security Foundations</p>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  --primary-color: #2c3e50;
  --secondary-color: #42b983;
  --accent-color: #e74c3c;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  --text-color: #333;
  --border-radius: 4px;
  --box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-color);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
  box-shadow: var(--box-shadow);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--secondary-color);
}


.main {
  flex: 1;
}

.footer {
  background-color: var(--primary-color);
  color: white;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
}

/* Estilos para formularios */
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.form-title {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--secondary-color);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}

.btn-block {
  display: block;
  width: 100%;
}

.text-center {
  text-align: center;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.alert {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.form-footer a {
  color: var(--secondary-color);
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    width: 100%;
    justify-content: center;
  }
}
</style>
