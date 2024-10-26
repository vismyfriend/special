<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="нажать здесь, чтобы перезагрузить"
        no-caps
      />
      <div style="font-size: 30vh">
        404 hmm...
        <h3>сфоткайте и отправьте Винсентику</h3>
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Что-то пошло не так.
      </div>

    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ErrorNotFound'
});
</script>
