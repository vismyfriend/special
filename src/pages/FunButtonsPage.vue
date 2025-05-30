<template>
  <q-btn
    class="q-mb-sm zoomIn"
    icon="camera"
    label="see photos of secret agents!"
    push
    color="primary"
    @click="goToPhotosOfAgentsPage"
  />
  <q-btn
    class="q-mb-sm zoomIn"
    icon="mail"
    label="пройти тест"
    push
    color="primary"
    @click="test"
  />
  <q-btn
    class="q-mb-sm zoomIn"
    icon="search"
    label="Vismycoder"
    push
    color="green"
    @click="goVismyCoderPage"
  />
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goToPhotosOfAgentsPage = () => router.push('/photos-of-agents');
const test = () => router.push('/vismyfriend');
const goVismyCoderPage = () => router.push('/vismycoder');
</script>
