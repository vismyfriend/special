<template>
  <div class="settings">
    <button class="back-btn" @click="$router.back()">← назад</button>

    <h1>{{ set.mission_visible_name || '—' }}</h1>
    <p class="desc">{{ set.mission_description || 'Без описания' }}</p>
    <p class="meta">
      Слов: {{ set.words?.length || 0 }}
      <span v-if="set.creator_username"> · от {{ set.creator_username }}</span>
    </p>

    <div class="actions">
      <button class="btn" @click="onClone" :disabled="busy">
        📋 Клонировать
      </button>
      <button
        v-if="isOwner"
        class="btn btn--danger"
        @click="onDelete"
        :disabled="busy"
      >
        🗑️ Удалить
      </button>
    </div>

    <p v-if="!isOwner" class="hint">
      Это чужой набор — можно только клонировать к себе.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import WordSetsApi from '../api/wordSets';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const set = ref({});
const busy = ref(false);

// Проверка: принадлежит ли набор текущему пользователю
const isOwner = computed(() => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId === set.value.user_id;
  } catch {
    return false;
  }
});

onMounted(async () => {
  try {
    const { data } = await WordSetsApi.getOne(route.params.missionName);
    set.value = data;
  } catch (e) {
    $q.notify({ message: 'Не удалось загрузить набор', color: 'negative' });
    router.push('/see-all-sets-of-words');
  }
});

const onClone = async () => {
  busy.value = true;
  try {
    const { data } = await WordSetsApi.clone(route.params.missionName);
    $q.notify({ message: 'Копия создана', color: 'positive' });
    router.push(`/see-all-sets-of-words/${data.record.mission_name}/wordSetSettings`);
  } catch (e) {
    $q.notify({
      message: e?.response?.data?.message || 'Ошибка клонирования',
      color: 'negative',
    });
  } finally {
    busy.value = false;
  }
};

const onDelete = async () => {
  if (!confirm('Удалить набор безвозвратно?')) return;
  busy.value = true;
  try {
    await WordSetsApi.delete(route.params.missionName);
    $q.notify({ message: 'Удалено', color: 'positive' });
    router.push('/see-all-sets-of-words');
  } catch (e) {
    $q.notify({
      message: e?.response?.data?.message || 'Ошибка удаления',
      color: 'negative',
    });
  } finally {
    busy.value = false;
  }
};
</script>

<style lang="scss" scoped>
.settings {
  max-width: 600px;
  margin: 80px auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
.back-btn {
  background: none;
  border: none;
  color: #0274ff;
  cursor: pointer;
  margin-bottom: 16px;
  font-size: 14px;
}
h1 {
  margin: 0 0 8px;
  font-size: 22px;
}
.desc {
  color: #666;
  margin: 0 0 4px;
}
.meta {
  color: #999;
  font-size: 13px;
  margin: 0 0 24px;
}
.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #f5f5f5; }
}
.btn--danger {
  border-color: #e5484d;
  color: #e5484d;
  &:hover:not(:disabled) { background: #ffe6e6; }
}
.hint {
  margin-top: 16px;
  font-size: 13px;
  color: #999;
  font-style: italic;
}
</style>
