<template>
  <body>
  <Navbar></Navbar>
  <RouterView/>
  </body>

</template>


<script setup>

import Navbar from "@/components/Navbar.vue";
</script>

<style>
body {
  background-color: #121212;
}
</style>