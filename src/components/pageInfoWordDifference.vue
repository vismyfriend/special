<script setup>
import { ref } from 'vue';

const cards = ref([
  {
    id: 1,
    front: {
      title: "Say vs. Tell",
      content: "You say something (a statement); you tell someone (a person + information).",
      examples: ["“She said hello.”", "“He told me the news.”"]
    },
    back: {
      explanation: "«Say» — для передачи информации; «Tell» требует указания слушателя."
    }
  },
  {
    id: 2,
    front: {
      title: "Travel vs. Trip",
      content: "Travel is the general act of going places; a trip is one specific journey.",
      examples: ["“I love to travel.”", "“We went on a weekend trip to Paris.”"]
    },
    back: {
      explanation: "«Travel» — общее понятие о путешествиях; «Trip» — конкретная поездка."
    }
  },
  {
    id: 3,
    front: {
      title: "Listen vs. Hear",
      content: "Hear is passive (it happens automatically); Listen is active (you do it on purpose).",
      examples: ["“Can you hear that noise?”", "“I’m listening to music.”"]
    },
    back: {
      explanation: "«Hear» — пассивное восприятие звука; «Listen» — активное внимание."
    }
  },
  {
    id: 4,
    front: {
      title: "Each vs. Every",
      content: "Each focuses on individual items; every focuses on the group as a whole.",
      examples: ["“Each student got a book.”", "“Every student passed the test.”"]
    },
    back: {
      explanation: "«Each» — акцент на отдельных элементах; «Every» — на группе в целом."
    }
  },
  {
    id: 5,
    front: {
      title: "Speak vs. Talk",
      content: "Speak is more formal or one-way; Talk is casual and two-way.",
      examples: ["“May I speak with the manager?”", "“Let’s talk after class.”"]
    },
    back: {
      explanation: "«Speak» — формальное или одностороннее общение; «Talk» — неформальное и двустороннее."
    }
  },
  {
    id: 6,
    front: {
      title: "House vs. Home",
      content: "A house is the building; home is the feeling or personal space.",
      examples: ["“We built a new house.”", "“This place feels like home.”"]
    },
    back: {
      explanation: "«House» — здание; «Home» — место с эмоциональной привязанностью."
    }
  },
  {
    id: 7,
    front: {
      title: "Look vs. See",
      content: "See is automatic (your eyes work); look means you try to see.",
      examples: ["“Look at the sky!”", "“I can see the stars.”"]
    },
    back: {
      explanation: "«See» — автоматическое зрение; «Look» — намеренное действие."
    }
  },
  {
    id: 8,
    front: {
      title: "Fun vs. Funny",
      content: "Fun means enjoyable or entertaining; funny means it makes you laugh.",
      examples: ["“The party was really fun.”", "“That joke was so funny!”"]
    },
    back: {
      explanation: "«Fun» — что-то приятное; «Funny» — что-то смешное."
    }
  },
  {
    id: 9,
    front: {
      title: "Job vs. Work",
      content: "A job is a specific position (noun); Work is the general activity you do (noun or verb).",
      examples: ["“She has a job at the bank.”", "“I work every weekday.”"]
    },
    back: {
      explanation: "«Job» — конкретная должность; «Work» — общая деятельность."
    }
  },
  {
    id: 10,
    front: {
      title: "Borrow vs. Lend",
      content: "Borrow means you take something from someone; Lend means you give something to someone.",
      examples: ["“Can I borrow your pen?”", "“I will lend you my pen.”"]
    },
    back: {
      explanation: "«Borrow» — взять взаймы; «Lend» — дать взаймы."
    }
  },
  {
    id: 11,
    front: {
      title: "Still vs. Yet",
      content: "Still means something is continuing; Yet means something hasn’t happened but is expected.",
      examples: ["“I’m still waiting.”", "“He hasn’t arrived yet.”"]
    },
    back: {
      explanation: "«Still» — действие продолжается; «Yet» — действие ещё не началось."
    }
  },
  {
    id: 12,
    front: {
      title: "Since vs. For",
      content: "Since shows the starting point; For shows the length of time.",
      examples: ["“I’ve lived here since 2020.”", "“I’ve lived here for 3 years.”"]
    },
    back: {
      explanation: "«Since» — начало периода; «For» — продолжительность."
    }
  }
]);

const flipCard = (id) => {
  const card = cards.value.find(card => card.id === id);
  if (card) card.isFlipped = !card.isFlipped;
};
</script>

<template>
  <div class="cards-container">
    <div
      v-for="card in cards"
      :key="card.id"
      class="card"
      :class="{ 'is-flipped': card.isFlipped }"
      @click="flipCard(card.id)"
    >
      <div class="card-face card-front">
        <div class="card-content">
          <h3>{{ card.front.title }}</h3>
          <div class="divider"></div>
          <p class="definition">{{ card.front.content }}</p>
          <div class="examples">
            <p v-for="(example, index) in card.front.examples" :key="index" class="example">
              <span class="quote">“</span>{{ example }}<span class="quote">”</span>
            </p>
          </div>
          <div class="flip-hint">Click to flip →</div>
        </div>
      </div>
      <div class="card-face card-back">
        <div class="card-content">
          <h3>{{ card.front.title }}</h3>
          <div class="divider"></div>
          <p class="explanation">{{ card.back.explanation }}</p>
          <div class="flip-hint">← Click to return</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  padding: 30px;
  max-width: 1300px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.card {
  position: relative;
  height: 240px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  perspective: 1000px;
  border-radius: 16px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  &.is-flipped {
    transform: rotateY(180deg) translateY(-5px);
  }
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  padding: 25px;
  box-sizing: border-box;
  display: flex;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card-front {
  background: linear-gradient(135deg, #f9f9ff 0%, #ffffff 100%);
  border: 1px solid rgba(221, 221, 255, 0.5);

  h3 {
    color: #4a4aef;
    margin: 0 0 12px 0;
    font-size: 1.4rem;
    font-weight: 600;
    text-align: center;
  }

  .definition {
    color: #555;
    margin: 10px 0;
    font-size: 1rem;
    line-height: 1.5;
  }

  .examples {
    margin-top: auto;
    padding-top: 12px;

    .example {
      color: #4a4aef;
      margin: 8px 0;
      font-size: 0.95rem;
      line-height: 1.4;

      .quote {
        color: #aaa;
        font-size: 1.2em;
        vertical-align: middle;
      }
    }
  }
}

.card-back {
  background: linear-gradient(135deg, #4a4aef 0%, #2a2acf 100%);
  transform: rotateY(180deg);

  h3 {
    color: #fff;
    margin: 0 0 12px 0;
    font-size: 1.4rem;
    font-weight: 600;
    text-align: center;
  }

  .explanation {
    color: rgba(255, 255, 255, 0.9);
    margin: 10px 0;
    font-size: 1.1rem;
    line-height: 1.5;
    text-align: center;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, rgba(74, 74, 239, 0.1) 0%, rgba(74, 74, 239, 0.5) 50%, rgba(74, 74, 239, 0.1) 100%);
  margin: 0 auto 15px auto;
  width: 80%;

  .card-back & {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 100%);
  }
}

.flip-hint {
  color: #aaa;
  font-size: 0.85rem;
  text-align: right;
  margin-top: auto;
  padding-top: 10px;
  opacity: 0.7;
  transition: opacity 0.3s;

  .card:hover & {
    opacity: 1;
  }

  .card-back & {
    color: rgba(255, 255, 255, 0.7);
    text-align: left;
  }
}
</style>
