<template>
  <header class="w-full px-4 lg:px-16 h-12 flex items-center relative z-10">
    <nav class="flex space-x-4">
      <a 
        href="#" 
        class="text-white px-4 py-2 text-sm lg:text-base rounded hover:bg-yellow-500 transition duration-200 active:bg-yellow-500"
      >
        Home
      </a>
      <a 
        href="#" 
        class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded hover:bg-yellow-500 transition duration-200"
      >
        Películas
      </a>
      <a 
        href="#" 
        class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded hover:bg-yellow-500 transition duration-200"
      >
        Mi Actividad
      </a>
      <a 
        href="#" 
        class="text-white px-4 py-2 text-sm lg:text-base font-poppins rounded hover:bg-yellow-500 transition duration-200"
      >
        Mi Lista
      </a>
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
