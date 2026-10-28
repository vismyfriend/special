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
      <button v-if="isOwner" class="btn" @click="onEdit" :disabled="busy">
        ✏️ Редактировать
      </button>
      <button class="btn" @click="onClone" :disabled="busy">
        📋 Клонировать к себе
      </button>
      <button v-if="isOwner" class="btn btn--danger" @click="onDelete" :disabled="busy">
        🗑️ Удалить
      </button>
    </div>

    <p v-if="!isOwner && isFromDb" class="hint">
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
const isFromDb = ref(false);

// Проверка: принадлежит ли набор текущему пользователю
const isOwner = computed(() => {
  if (!isFromDb.value) return false;
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Number(payload.userId) === Number(set.value.user_id);
  } catch {
    return false;
  }
});

onMounted(async () => {
  try {
    const { data } = await WordSetsApi.getOne(route.params.missionName);
    set.value = data;
    isFromDb.value = true;
  } catch (e) {
    $q.notify({ message: 'Обнови страницу (если зависло и ли не загрузились наборы)', color: 'negative' });
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
const onEdit = () => {
  router.push(`/see-all-sets-of-words/${route.params.missionName}/edit`);
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
