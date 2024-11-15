<template>
  <header class="w-full max-w-full px-16 h-12 flex items-center relative z-10">
    <nav>
      <a href="#" class="active">Home</a>
      <a href="#">Películas</a>
      <a href="#">Mi Actividad</a>
      <a href="#">Mi Lista</a>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style scoped>
header {
  position: relative;
  z-index: 1000;
}

header nav a {
  color: #fff;
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-family: 'Poppins';
  transition: 0.2s;
  text-decoration: none;
}

a.active {
  background: #FFD700;
  border-radius: 2px;
}

a:hover {
  background: #FFD700;
  border-radius: 2px;
}
</style>
