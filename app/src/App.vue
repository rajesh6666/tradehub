<script setup>
import Navbar from './components/Navbar.vue';
</script>

<template>
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen dark:text-white">
        <Navbar />

        <RouterView />
    </div>
</template>

<style scoped>

</style>