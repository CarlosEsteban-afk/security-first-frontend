<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1>Sistema de Autenticación Seguro</h1>
        <p>Implementado con AWS Cognito y Vue.js</p>
        <div class="hero-buttons">
          <router-link to="/register" class="btn btn-primary">Registrarse</router-link>
          <router-link to="/login" class="btn btn-outline">Iniciar Sesión</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="/src/assets/logo.svg" alt="Seguridad en la nube" />
      </div>
    </section>

    <section class="features">
      <h2 class="section-title">Características de Seguridad</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3>Autenticación Multifactor</h3>
          <p>Protege tu cuenta con una capa adicional de seguridad usando MFA.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-lock"></i>
          </div>
          <h3>Contraseñas Seguras</h3>
          <p>Políticas de contraseñas robustas para garantizar la seguridad de tu cuenta.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <h3>Verificación por Email</h3>
          <p>Verificación de correo electrónico para confirmar la identidad de los usuarios.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-user-shield"></i>
          </div>
          <h3>Control de Acceso</h3>
          <p>Acceso a diferentes secciones según el rol del usuario.</p>
        </div>
      </div>
    </section>

    <section class="about">
      <h2 class="section-title">Sobre el Proyecto</h2>
      <p>
        Este sistema de autenticación seguro ha sido desarrollado como parte del curso AWS Academy Cloud Security
        Foundations.
        Implementa las mejores prácticas de seguridad en la nube utilizando servicios de AWS como Cognito, CloudWatch y
        GuardDuty.
      </p>
    </section>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para esta página
</script>

<style scoped>
.home-page {
  padding: 1rem 0;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
  gap: 2rem;
}

.hero-content {
  flex: 1;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--dark-color);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background-color: var(--secondary-color);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-outline {
  background-color: transparent;
  color: var(--secondary-color);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  border: 2px solid var(--secondary-color);
  font-weight: 600;
  transition: all 0.3s;
}

.btn-outline:hover {
  background-color: var(--secondary-color);
  color: white;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  max-height: 400px;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.features {
  margin-bottom: 3rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  text-align: center;
}

.feature-icon {
  font-size: 2rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.about {
  background-color: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
}

.about p {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
  }

  .hero-content {
    text-align: center;
  }

  .hero-buttons {
    justify-content: center;
  }
}
</style>
