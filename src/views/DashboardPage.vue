<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="user-info">
        <span class="welcome-message">Bienvenido, {{ user.name }}</span>
        <div class="user-avatar">
          <img :src="user.avatar" :alt="user.name" />
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="dashboard-card">
        <h2>Información de la cuenta</h2>
        <div class="account-info">
          <div class="info-item">
            <span class="info-label">Nombre:</span>
            <span class="info-value">{{ user.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ user.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Rol:</span>
            <span class="info-value">{{ user.role }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">MFA:</span>
            <span class="info-value"
              :class="{ 'status-enabled': user.mfaEnabled, 'status-disabled': !user.mfaEnabled }">
              {{ user.mfaEnabled ? 'Habilitado' : 'Deshabilitado' }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Último acceso:</span>
            <span class="info-value">{{ user.lastLogin }}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <h2>Seguridad de la cuenta</h2>
        <div class="security-score">
          <div class="score-label">Puntuación de seguridad</div>
          <div class="score-bar">
            <div class="score-value" :style="{ width: `${securityScore}%` }"></div>
          </div>
          <div class="score-percentage">{{ securityScore }}%</div>
        </div>

        <div class="security-recommendations">
          <h3>Recomendaciones</h3>
          <ul class="recommendations-list">
            <li v-for="(recommendation, index) in securityRecommendations" :key="index" class="recommendation-item">
              <div class="recommendation-icon" :class="{ 'completed': recommendation.completed }">
                <i :class="recommendation.completed ? 'fas fa-check' : 'fas fa-exclamation'"></i>
              </div>
              <div class="recommendation-content">
                <div class="recommendation-title">{{ recommendation.title }}</div>
                <div class="recommendation-description">{{ recommendation.description }}</div>
              </div>
              <button v-if="!recommendation.completed" class="btn btn-sm">Resolver</button>
            </li>
          </ul>
        </div>
      </div>

      <div class="dashboard-card">
        <h2>Actividad reciente</h2>
        <div class="activity-list">
          <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <i :class="getActivityIcon(activity.type)"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-details">{{ activity.details }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const user = reactive({
  name: 'Carlos Peña',
  email: 'carlos.pena@ejemplo.com',
  role: 'Usuario',
  mfaEnabled: true,
  lastLogin: '15 de abril, 2025 10:30 AM',
  avatar: ''
})

const securityScore = 85

const securityRecommendations = [
  {
    title: 'Autenticación de dos factores',
    description: 'Has habilitado la autenticación de dos factores para tu cuenta.',
    completed: true
  },
  {
    title: 'Contraseña fuerte',
    description: 'Tu contraseña cumple con los requisitos de seguridad.',
    completed: true
  },
  {
    title: 'Revisar dispositivos conectados',
    description: 'Revisa y elimina los dispositivos no reconocidos que tienen acceso a tu cuenta.',
    completed: false
  }
]

const recentActivity = [
  {
    type: 'login',
    title: 'Inicio de sesión exitoso',
    details: 'Desde Santiago, Chile usando Chrome en Windows',
    time: 'Hace 5 minutos'
  },
  {
    type: 'mfa',
    title: 'Verificación MFA completada',
    details: 'Autenticación de dos factores verificada correctamente',
    time: 'Hace 5 minutos'
  },
  {
    type: 'login',
    title: 'Inicio de sesión exitoso',
    details: 'Desde Santiago, Chile usando Chrome en Windows',
    time: 'Ayer, 15:45'
  },
  {
    type: 'password',
    title: 'Contraseña actualizada',
    details: 'Has cambiado tu contraseña correctamente',
    time: 'Hace 3 días'
  }
]

const getActivityIcon = (type) => {
  const icons = {
    login: 'fas fa-sign-in-alt',
    logout: 'fas fa-sign-out-alt',
    mfa: 'fas fa-shield-alt',
    password: 'fas fa-key',
    profile: 'fas fa-user-edit'
  }

  return icons[type] || 'fas fa-info-circle'
}
</script>

<style scoped>
.dashboard-page {
  padding: 1rem 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.dashboard-header h1 {
  color: var(--primary-color);
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-message {
  font-weight: 500;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--secondary-color);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
}

.dashboard-card h2 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
}

.info-label {
  font-weight: 600;
  color: var(--dark-color);
}

.status-enabled {
  color: #28a745;
  font-weight: 600;
}

.status-disabled {
  color: #dc3545;
  font-weight: 600;
}

.security-score {
  margin-bottom: 2rem;
}

.score-label {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.score-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.score-value {
  height: 100%;
  background-color: var(--secondary-color);
  border-radius: 4px;
}

.score-percentage {
  text-align: right;
  font-weight: 600;
  color: var(--secondary-color);
}

.security-recommendations h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
}

.recommendation-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dc3545;
  color: white;
  flex-shrink: 0;
}

.recommendation-icon.completed {
  background-color: #28a745;
}

.recommendation-content {
  flex: 1;
}

.recommendation-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.recommendation-description {
  font-size: 0.9rem;
  color: #666;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-icon.login {
  background-color: #007bff;
}

.activity-icon.logout {
  background-color: #6c757d;
}

.activity-icon.mfa {
  background-color: #28a745;
}

.activity-icon.password {
  background-color: #fd7e14;
}

.activity-icon.profile {
  background-color: #17a2b8;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.activity-details {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.8rem;
  color: #999;
}
</style>
