"use strict";

const STORAGE_KEY = "mundo-magico-emociones-v1";

const areas = [
  {
    id: "joy",
    name: "Jardín de la Alegría",
    emoji: "🌈",
    guide: "¡Las flores brillan cuando compartimos alegría!",
    decoration: "🌷",
    reward: "Flor arcoíris",
    questions: [
      { friend: "🐰", scene: "Conejita terminó su torre y salta de emoción.", prompt: "¿Cómo se siente conejita?", options: ["Alegre", "Triste", "Enojada"], answer: 0, feedback: "¡Sí! Está alegre porque algo bonito pasó." },
      { friend: "🐻", scene: "Osito tiene una pelota. Su amiga también quiere jugar.", prompt: "¿Qué puede hacer osito para compartir?", options: ["Invitarla a jugar", "Esconder la pelota", "Irse sin decir nada"], answer: 0, feedback: "¡Qué idea tan amable! Jugar juntos puede ser divertido." },
      { friend: "🦊", scene: "Zorrito sonríe y quiere contar algo bonito.", prompt: "¿Qué cara muestra que está alegre?", options: ["Una sonrisa", "Un puchero", "Ceño fruncido"], answer: 0, feedback: "¡Lo descubriste! La sonrisa puede mostrarnos alegría." }
    ]
  },
  {
    id: "sadness",
    name: "Lago de la Tristeza",
    emoji: "🌧️",
    guide: "A veces una nube llega; podemos acompañarnos.",
    decoration: "🪷",
    reward: "Nenúfar luminoso",
    questions: [
      { friend: "🐼", scene: "Panda extraña a su familia cuando se despide.", prompt: "¿Qué podría sentir panda?", options: ["Tristeza", "Alegría", "Sorpresa"], answer: 0, feedback: "Sí, puede sentirse triste. Todas las emociones merecen espacio." },
      { friend: "🐨", scene: "Koala se siente triste y quiere estar con alguien.", prompt: "¿Qué puede hacer su amiga?", options: ["Escuchar y acompañar", "Decirle que no llore", "Alejarse riendo"], answer: 0, feedback: "Acompañar y escuchar es una forma muy bonita de ayudar." },
      { friend: "🐸", scene: "Ranita extraña un juguete que perdió.", prompt: "¿Qué palabras amables podríamos decirle?", options: ["Estoy aquí contigo", "No importa, cállate", "Es tu culpa"], answer: 0, feedback: "¡Qué palabras tan cuidadosas! Una amiga puede escuchar." }
    ]
  },
  {
    id: "anger",
    name: "Volcán del Enojo",
    emoji: "🌋",
    guide: "El enojo nos visita; una pausa nos ayuda a cuidarnos.",
    decoration: "💎",
    reward: "Cristal brillante",
    questions: [
      { friend: "🦁", scene: "León construía y alguien derribó sus bloques sin querer.", prompt: "¿Qué emoción podría sentir león?", options: ["Enojo", "Calma", "Alegría"], answer: 0, feedback: "Sí, puede sentir enojo. Podemos sentirlo y buscar qué hacer." },
      { friend: "🐯", scene: "Tigre siente mucho enojo cuando le toca esperar.", prompt: "¿Qué puede probar para cuidarse?", options: ["Parar y respirar despacio", "Empujar a un amigo", "Gritar muy cerca"], answer: 0, feedback: "Una pausa para respirar puede ayudar. ¡Buen plan!" },
      { friend: "🐵", scene: "Mono y su amigo quieren el mismo columpio.", prompt: "¿Qué solución pueden intentar?", options: ["Turnarse", "Empujarse", "Quitar el columpio"], answer: 0, feedback: "Turnarse es una solución justa para jugar juntos." }
    ]
  },
  {
    id: "fear",
    name: "Cueva del Miedo",
    emoji: "🌙",
    guide: "Ser valiente también es pedir compañía.",
    decoration: "⭐",
    reward: "Estrella protectora",
    questions: [
      { friend: "🦔", scene: "Erizo escucha un ruido nuevo y se acerca a su maestra.", prompt: "¿Qué podría sentir erizo?", options: ["Miedo", "Aburrimiento", "Alegría"], answer: 0, feedback: "Podría sentir miedo. Pedir compañía está muy bien." },
      { friend: "🐱", scene: "Gatita tiene miedo de entrar a un lugar oscuro.", prompt: "¿Qué puede hacer gatita?", options: ["Pedir que alguien la acompañe", "Irse sola sin avisar", "Burlarse de sí misma"], answer: 0, feedback: "¡Exacto! Podemos pedir ayuda cuando algo nos da miedo." },
      { friend: "🐢", scene: "Tortuga está nerviosa antes de probar algo nuevo.", prompt: "¿Qué le podríamos decir?", options: ["Podemos probar juntos", "No tengas miedo", "Hazlo rápido"], answer: 0, feedback: "Ofrecer compañía le recuerda que no está sola." }
    ]
  },
  {
    id: "calm",
    name: "Bosque de la Calma",
    emoji: "🍃",
    guide: "En este bosque respiramos como si oliéramos una flor.",
    decoration: "🦋",
    reward: "Mariposa tranquila",
    questions: [
      { friend: "🐉", scene: "Lumi quiere enseñarte una respiración suave.", prompt: "Toca la hoja para hacer juntos una pausa tranquila.", breath: true, feedback: "¡Qué bien! Una respiración suave puede ayudarnos a hacer una pausa." },
      { friend: "🦥", scene: "Perezoso nota que su cuerpo está inquieto.", prompt: "¿Qué puede ayudarle a hacer una pausa?", options: ["Respirar lento", "Correr más rápido", "Empujar una silla"], answer: 0, feedback: "Respirar despacio ayuda al cuerpo a descansar un poquito." },
      { friend: "🐦", scene: "Pajarito quiere contar cómo se siente.", prompt: "¿Qué podemos hacer para escucharlo?", options: ["Mirarlo y escuchar con calma", "Interrumpirlo", "Irnos mientras habla"], answer: 0, feedback: "Escuchar con calma ayuda a que pajarito se sienta acompañado." }
    ]
  }
];

const defaultProgress = () => ({ stars: 0, completed: [], history: [], chestOpened: false });
let progress = loadProgress();
let activeArea = null;
let questionIndex = 0;
let speechEnabled = false;
let soundEnabled = true;
let speechUtterance = null;
let toastTimer;
let transitionTimer;
let audioContext;
let soundUnavailable = false;

const screens = {
  welcome: document.getElementById("welcome-screen"),
  map: document.getElementById("map-screen"),
  adventure: document.getElementById("adventure-screen"),
  teacher: document.getElementById("teacher-screen")
};

function loadProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== "object") return defaultProgress();
    return {
      stars: Number.isInteger(stored.stars) && stored.stars >= 0 ? stored.stars : 0,
      completed: Array.isArray(stored.completed) ? stored.completed.filter(id => areas.some(area => area.id === id)) : [],
      history: Array.isArray(stored.history) ? stored.history.filter(item => item && areas.some(area => area.id === item.id) && typeof item.date === "string") : [],
      chestOpened: stored.chestOpened === true
    };
  } catch (error) {
    console.warn("No se pudo leer el progreso guardado.", error);
    return defaultProgress();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("No se pudo guardar el progreso.", error);
    showToast("No pudimos guardar el progreso en este dispositivo.");
  }
}

function showScreen(name) {
  const activeScreen = Object.entries(screens).find(([, element]) => !element.hidden)?.[0];
  Object.entries(screens).forEach(([screenName, element]) => {
    const active = screenName === name;
    element.hidden = !active;
    element.classList.toggle("is-active", active);
  });
  document.getElementById("topbar").hidden = name === "welcome";
  if (activeScreen && activeScreen !== name && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const portal = document.getElementById("portal-transition");
    portal.classList.remove("is-opening");
    void portal.offsetWidth;
    portal.classList.add("is-opening");
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => portal.classList.remove("is-opening"), 700);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "map") renderMap();
  if (name === "teacher") renderTeacher();
}

function renderMap() {
  document.getElementById("star-count").textContent = String(progress.stars);
  const completed = new Set(progress.completed);
  const nextArea = areas.find((area, index) => !completed.has(area.id) && (index === 0 || completed.has(areas[index - 1].id)));
  areas.forEach((area, index) => {
    const node = document.querySelector(`[data-area="${area.id}"]`);
    const unlocked = index === 0 || completed.has(areas[index - 1].id);
    const done = completed.has(area.id);
    node.disabled = !unlocked;
    node.classList.toggle("is-complete", done);
    node.classList.toggle("is-locked", !unlocked);
    node.classList.toggle("is-next", area.id === nextArea?.id);
    node.setAttribute("aria-label", `${area.name}${done ? ", aventura completada" : unlocked ? ", disponible" : ", bloqueada"}`);
  });
  document.getElementById("map-guide").textContent = areas.find((area, index) => index === 0 || completed.has(areas[index - 1].id))?.guide || "¡Has explorado todas las islas!";
  document.getElementById("progress-label").textContent = `${completed.size} de ${areas.length} aventuras`;
  document.getElementById("progress-fill").style.width = `${completed.size / areas.length * 100}%`;
  const decorations = document.getElementById("island-decorations");
  document.querySelector(".treasure-card").classList.toggle("is-chest-open", progress.chestOpened);
  decorations.replaceChildren();
  if (completed.size === 0) {
    const empty = document.createElement("span");
    empty.className = "empty-decoration";
    empty.textContent = "Tus premios aparecerán aquí";
    decorations.append(empty);
  } else {
    areas.filter(area => completed.has(area.id)).forEach(area => {
      const token = document.createElement("span");
      token.className = "decoration-token";
      token.title = area.reward;
      token.setAttribute("aria-label", area.reward);
      token.textContent = area.decoration;
      decorations.append(token);
    });
  }
}

function startAdventure(areaId) {
  const areaIndex = areas.findIndex(area => area.id === areaId);
  const unlocked = areaIndex === 0 || progress.completed.includes(areas[areaIndex - 1]?.id);
  if (areaIndex < 0 || !unlocked) return;
  activeArea = areas[areaIndex];
  questionIndex = 0;
  const adventure = screens.adventure;
  adventure.dataset.area = activeArea.id;
  document.getElementById("area-emoji").textContent = activeArea.emoji;
  document.getElementById("area-kicker").textContent = activeArea.name.toLocaleUpperCase("es");
  document.getElementById("adventure-title").textContent = activeArea.name;
  document.getElementById("continue-button").hidden = true;
  showScreen("adventure");
  renderQuestion();
}

function renderQuestion() {
  const question = activeArea.questions[questionIndex];
  const scene = document.getElementById("friend-scene");
  scene.replaceChildren();
  const avatar = document.createElement("span");
  avatar.className = "friend-avatar";
  avatar.textContent = question.friend;
  const description = document.createElement("span");
  description.textContent = question.scene;
  scene.append(avatar, description);
  document.getElementById("question-text").textContent = question.prompt;
  document.getElementById("question-count").textContent = `Reto ${questionIndex + 1} de ${activeArea.questions.length}`;
  document.getElementById("question-fill").style.width = `${questionIndex / activeArea.questions.length * 100}%`;
  document.getElementById("feedback").hidden = true;
  document.getElementById("continue-button").hidden = true;
  document.getElementById("lumi-dialogue").textContent = question.breath ? "Toca y respiremos juntos." : "¡Piensa con calma, yo te acompaño!";
  const answerGrid = document.getElementById("answer-grid");
  answerGrid.replaceChildren();
  if (question.breath) {
    const breathButton = document.createElement("button");
    breathButton.type = "button";
    breathButton.className = "breath-button";
    breathButton.textContent = "🌼 Toca para respirar";
    answerGrid.append(breathButton);
    return;
  }
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-card";
    button.textContent = option;
    answerGrid.append(button);
  });
  speak(question.scene + " " + question.prompt);
}

function guideBreathing(button) {
  let step = 0;
  button.disabled = true;
  const phases = [
    { text: "🌸 Huele la flor... inspira", voice: "Huele la flor. Inspira suave." },
    { text: "🕯️ Sopla la vela... suelta el aire", voice: "Ahora sopla la vela. Suelta el aire despacito." },
    { text: "💚 ¡Lo hiciste! Tu cuerpo descansó", voice: "Lo hiciste. Tu cuerpo descansó." }
  ];
  button.textContent = phases[0].text;
  speak(phases[0].voice);
  const interval = window.setInterval(() => {
    step += 1;
    if (step >= phases.length) {
      window.clearInterval(interval);
      showFeedback(activeArea.questions[questionIndex].feedback, true);
      return;
    }
    button.textContent = phases[step].text;
    speak(phases[step].voice);
  }, 2500);
}

function chooseAnswer(selectedIndex) {
  const question = activeArea.questions[questionIndex];
  const buttons = [...document.querySelectorAll(".answer-card")];
  buttons.forEach(button => { button.disabled = true; });
  if (selectedIndex === question.answer) {
    buttons[selectedIndex].classList.add("is-correct");
    showFeedback(question.feedback, true);
    playChime();
    return;
  }
  buttons[selectedIndex].classList.add("is-gentle");
  buttons[question.answer].classList.add("is-correct");
  showFeedback("¡Gracias por intentarlo! A veces podemos pensarlo juntos. " + question.feedback, false);
}

function showFeedback(message, correct) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.hidden = false;
  document.getElementById("lumi-dialogue").textContent = correct ? "¡Cada idea nos ayuda a aprender! ✨" : "No pasa nada, aprendemos poquito a poquito. 💚";
  const continueButton = document.getElementById("continue-button");
  continueButton.hidden = false;
  continueButton.textContent = questionIndex === activeArea.questions.length - 1 ? "TERMINAR AVENTURA ✨" : "SEGUIR AVENTURA ➜";
  speak(message);
}

function nextQuestion() {
  questionIndex += 1;
  if (questionIndex < activeArea.questions.length) {
    renderQuestion();
    return;
  }
  completeAdventure();
}

function completeAdventure() {
  const isNew = !progress.completed.includes(activeArea.id);
  if (isNew) {
    progress.completed.push(activeArea.id);
    progress.stars += 1;
    progress.history.unshift({ id: activeArea.id, date: new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date()) });
    progress.chestOpened = false;
    saveProgress();
  }
  document.getElementById("celebration-title").textContent = isNew ? "¡Lo hiciste genial!" : "¡Qué bueno verte otra vez!";
  document.getElementById("celebration-copy").textContent = isNew ? "Una estrella para ti y un regalo para tu isla." : "Puedes volver a jugar cuando quieras.";
  document.getElementById("reward-name").textContent = isNew ? activeArea.reward : "¡Tu isla te espera!";
  document.getElementById("celebration").classList.add("is-open");
  if (isNew) scatterCelebrationStars();
  document.getElementById("star-count").textContent = String(progress.stars);
  playChime();
  speak(isNew ? "¡Aventura completada! Ganaste una estrella y " + activeArea.reward : "Aventura completada. ¡Qué bueno verte otra vez!");
}

function renderTeacher() {
  document.getElementById("teacher-progress").innerHTML = `${progress.completed.length} <small>de ${areas.length}</small>`;
  document.getElementById("teacher-summary-copy").textContent = progress.completed.length === areas.length ? "¡El mapa entero está lleno de aventuras!" : "Cada paso es una oportunidad para aprender.";
  const list = document.getElementById("teacher-history-list");
  list.replaceChildren();
  if (!progress.history.length) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "Todavía no hay aventuras completadas.";
    list.append(empty);
    return;
  }
  progress.history.forEach(entry => {
    const area = areas.find(item => item.id === entry.id);
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = `${area.emoji} ${area.name}`;
    const date = document.createElement("span");
    date.className = "history-badge";
    date.textContent = entry.date;
    item.append(name, date);
    list.append(item);
  });
}

function openTreasure() {
  if (!progress.completed.length) {
    showToast("Completa una aventura para encontrar el primer regalo. ✨");
    return;
  }
  if (progress.chestOpened) {
    showToast("¡Tu cofre está vacío por ahora! Completa otra aventura para un nuevo regalo. 🎁");
    return;
  }
  progress.chestOpened = true;
  saveProgress();
  document.querySelector(".treasure-card").classList.add("is-chest-open");
  const newest = areas.find(area => area.id === progress.history[0]?.id);
  showToast(`¡Sorpresa! Encontraste ${newest?.reward || "un regalo mágico"} ${newest?.decoration || "✨"}`);
  playChime();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3600);
}

function speak(text) {
  if (!speechEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.lang = "es";
  speechUtterance.rate = 0.88;
  window.speechSynthesis.speak(speechUtterance);
}

function playChime() {
  if (!soundEnabled || soundUnavailable) return;
  try {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        soundUnavailable = true;
        return;
      }
      audioContext = new AudioContextClass();
    }
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.36);
  } catch (error) {
    soundUnavailable = true;
    console.warn("El efecto de sonido no está disponible en este navegador.", error);
    showToast("El sonido no está disponible, pero puedes seguir jugando.");
  }
}

function scatterCelebrationStars() {
  const confetti = document.getElementById("celebration-confetti");
  const symbols = ["✦", "✧", "★", "·", "✷"];
  const colors = ["#ffe38b", "#ff9fc6", "#9cf0ce", "#b8c2ff", "#fff4d1"];
  confetti.replaceChildren();
  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = symbols[index % symbols.length];
    piece.style.setProperty("--x", `${Math.round(Math.random() * 100)}%`);
    piece.style.setProperty("--color", colors[index % colors.length]);
    piece.style.setProperty("--size", `${12 + Math.round(Math.random() * 17)}px`);
    piece.style.setProperty("--delay", `${Math.random() * 0.9}s`);
    piece.style.setProperty("--duration", `${2.5 + Math.random() * 1.8}s`);
    confetti.append(piece);
  }
}

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action], [data-screen], [data-area], .answer-card, .breath-button, .button--continue");
  if (!target || target.disabled) return;
  if (target.matches("a")) event.preventDefault();
  if (target.matches(".button--continue")) {
    nextQuestion();
    return;
  }
  if (target.matches(".answer-card")) {
    chooseAnswer([...document.querySelectorAll(".answer-card")].indexOf(target));
    return;
  }
  if (target.matches(".breath-button")) {
    guideBreathing(target);
    return;
  }
  if (target.dataset.action === "start") showScreen("map");
  if (target.dataset.action === "home") showScreen("welcome");
  if (target.dataset.action === "map") showScreen("map");
  if (target.dataset.action === "treasure") openTreasure();
  if (target.dataset.screen === "teacher") showScreen("teacher");
  if (target.dataset.area) startAdventure(target.dataset.area);
});

document.getElementById("voice-toggle").addEventListener("click", event => {
  speechEnabled = !speechEnabled;
  const button = event.currentTarget;
  button.setAttribute("aria-pressed", String(speechEnabled));
  button.innerHTML = speechEnabled ? '🔊<span class="sr-only">Pausar voz</span>' : '🔈<span class="sr-only">Activar voz</span>';
  if (speechEnabled) speak("Hola, soy Lumi. ¡Vamos a jugar!");
  else if ("speechSynthesis" in window) window.speechSynthesis.cancel();
});

document.getElementById("sound-toggle").addEventListener("click", event => {
  soundEnabled = !soundEnabled;
  const button = event.currentTarget;
  button.setAttribute("aria-pressed", String(soundEnabled));
  button.title = soundEnabled ? "Silenciar sonidos" : "Activar sonidos";
  button.innerHTML = `${soundEnabled ? "♫" : "♪"}<span class="sr-only">${soundEnabled ? "Silenciar sonidos" : "Activar sonidos"}</span>`;
  if (soundEnabled) playChime();
});

document.getElementById("celebration-close").addEventListener("click", () => {
  document.getElementById("celebration").classList.remove("is-open");
  showScreen("map");
});

document.getElementById("celebration").addEventListener("click", event => {
  if (event.target.id === "celebration") {
    event.currentTarget.classList.remove("is-open");
    showScreen("map");
  }
});

document.getElementById("reset-progress").addEventListener("click", () => {
  if (!window.confirm("¿Borrar todas las aventuras y premios guardados en este dispositivo?")) return;
  progress = defaultProgress();
  saveProgress();
  renderTeacher();
  showToast("El progreso se borró de este dispositivo.");
});

if (!("speechSynthesis" in window)) {
  const voiceButton = document.getElementById("voice-toggle");
  voiceButton.disabled = true;
  voiceButton.title = "La lectura por voz no está disponible en este navegador";
}
