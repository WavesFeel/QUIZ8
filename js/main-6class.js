const img = document.querySelector(".content_games_img");
const menuItems = document.querySelectorAll(".lesson-list li");
const currentPage = window.location.pathname.split("/").pop();

// Подсветка активного пункта меню
menuItems.forEach(item => {
  const href = item.getAttribute("data-href");

  // Выделяем номер урока из href
  const hrefLessonMatch = href.match(/lesson(\d+)/);
  const currentLessonMatch =
    currentPage.match(/lesson(\d+)(-\d+)?\.html/) ||
    (currentPage === "index.html" ? [null, "1"] : null) ||
    (currentPage === "2lesson.html" ? [null, "1"] : null);


  if (hrefLessonMatch && currentLessonMatch) {
    const hrefLesson = parseInt(hrefLessonMatch[1]);
    const currentLesson = parseInt(currentLessonMatch[1]);

    if (hrefLesson === currentLesson) {
      item.classList.add("active");
    }
  } else if (href === currentPage) {
    // Например, index.html — Введение
    item.classList.add("active");
  }

  item.addEventListener("click", () => {
    if (href) window.location.href = href;
  });
});


// Конфигурация 6 класса
const lessonConfig = {
  1: { count: 8 },
  2: { count: 9 },
  3: { count: 9 },
  4: { count: 10 },
  5: { count: 8 },
  6: { count: 11 }
};

if (img) {
  const isLesson1Start = currentPage === "2lesson.html"; // <--- вот это новинка
  const matchLessonTask = currentPage.match(/2lesson(\d+)-(\d+)\.html$/);
  const matchOnlyLesson = currentPage.match(/2lesson(\d+)\.html$/);

  let lesson = null;
  let task = null;

  if (isLesson1Start) {
    lesson = 1;
    task = 1;
  } else if (matchLessonTask) {
    lesson = parseInt(matchLessonTask[1]);
    task = parseInt(matchLessonTask[2]);
  } else if (matchOnlyLesson) {
    lesson = parseInt(matchOnlyLesson[1]);
    task = 1;
  }

  console.log("currentPage:", currentPage);
  console.log("lesson:", lesson, "task:", task);

  img.addEventListener("click", () => {
    const config = lessonConfig[lesson];
    if (!config) {
      alert("Урок не найден в конфигурации");
      return;
    }

    const nextTask = task + 1;

    if (nextTask <= config.count) {
      window.location.href = `2lesson${lesson}-${nextTask}.html`;
    } else {
      const nextLesson = lesson + 1;
      const nextConfig = lessonConfig[nextLesson];

      if (nextConfig) {
        window.location.href = `2lesson${nextLesson}.html`;
      } else {
        alert("Вы прошли все уроки 6 класса!");
      }
    }
  });
}

// Кнопки переключения классов
document.querySelectorAll(".switch-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-href");
    if (target) {
      window.location.href = target;
    }
  });
});

// Выделение активной кнопки класса
const classButtons = document.querySelectorAll(".switch-btn");
// const currentPage = window.location.pathname.split("/").pop();

// Сначала убрать класс active у всех кнопок
classButtons.forEach(btn => btn.classList.remove("active"));

// Затем определить, какая страница — 5 или 6 класс
const is6class = currentPage.startsWith("2lesson") || currentPage === "2index.html";
const is5class = currentPage.startsWith("lesson") || currentPage === "index.html";

// И активировать нужную кнопку
classButtons.forEach(btn => {
  const href = btn.getAttribute("data-href");
  if (is5class && href === "index.html") {
    btn.classList.add("active");
  } else if (is6class && href === "2lesson.html") {
    btn.classList.add("active");
  }
});


function syncHeights() {
  setTimeout(() => {
    const menu = document.querySelector('.menu');
    const content = document.querySelector('.content_games');
    if (menu && content) {
      content.style.height = 'auto';
      content.style.height = menu.offsetHeight + 'px';
    }
  }, 100);
}

window.addEventListener('load', syncHeights);
window.addEventListener('resize', syncHeights);

document.addEventListener("DOMContentLoaded", () => {
  let testPassed = false;

  const testForm = document.getElementById("testForm");
  const testResult = document.getElementById("testResult");
  const startTestBtn = document.getElementById("startTestBtn");
  const testBlock = document.getElementById("testBlock");

  // Показываем тест при клике
if (startTestBtn && testBlock) {
  startTestBtn.addEventListener("click", () => {
    startTestBtn.style.display = "none";
    testBlock.style.display = "block";

    // ⬇️ Прокрутка вниз к тесту
    testBlock.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}


  // Проверка теста
  if (testForm && testResult) {
    testForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const answers = {
        q1: "25",
        q2: "no",
        q3: "shock"
      };

      let correct = 0;
      let total = Object.keys(answers).length;

      for (let q in answers) {
        const selected = testForm.querySelector(`input[name="${q}"]:checked`);
        if (selected && selected.value === answers[q]) {
          correct++;
        }
      }

      if (correct === total) {
        testPassed = true;
        testForm.style.display = "none";
        testResult.style.display = "block";
      } else {
        alert(`Ты ответил правильно на ${correct} из ${total} вопросов. Попробуй ещё раз.`);
      }
    });
  }

  // Переход к следующему уроку
  const nextLessonBtn = document.getElementById("nextLessonBtn");
  if (nextLessonBtn) {
    nextLessonBtn.addEventListener("click", () => {
      if (!testPassed) {
        alert("Сначала пройди тест!");
        return;
      }

      const currentPage = window.location.pathname.split("/").pop();
      const isSixthClass = currentPage.startsWith("2");

      const lessonMatch = currentPage.match(/(?:2)?lesson(\d+)/);
      const lessonNum = lessonMatch ? parseInt(lessonMatch[1]) : 1;

      const nextLesson = lessonNum + 1;
      const nextPage = isSixthClass
        ? `2lesson${nextLesson}.html`
        : `lesson${nextLesson}.html`;

      window.location.href = nextPage;
    });
  }
});


const sliders = {
  slider1: ["Процессор", "Охлаждение", "Радиатор"],
  slider2: ["Оперативная память", "SSD", "HDD"],
  slider3: ["Видеокарта", "Сетевая карта", "Звуковая карта"],
  slider4: ["Блок питания", "UPS", "Инвертор"],
  slider5: ["Материнская плата", "Чипсет", "BIOS"],
  slider6: ["Корпус", "Кулеры", "USB-порты"]
};

function createSlider(id, options) {
  const container = document.getElementById(id);
  if (!container) return; // <-- защита от ошибки

  let index = 0;

  container.innerHTML = `
    <button class="prev">◀</button>
    <span class="component">${options[index]}</span>
    <button class="next">▶</button>
    <span class="tooltip-btn" data-id="${id}">❓</span>
  `;

  const label = container.querySelector('.component');
  container.querySelector('.prev').onclick = () => {
    index = (index - 1 + options.length) % options.length;
    label.textContent = options[index];
  };
  container.querySelector('.next').onclick = () => {
    index = (index + 1) % options.length;
    label.textContent = options[index];
  };

  const tooltipBtn = container.querySelector('.tooltip-btn');
  tooltipBtn.addEventListener("click", () => {
    const text = tooltips[id] || "Описание недоступно.";
    const modal = document.getElementById("tooltipModal");
    const overlay = document.getElementById("tooltipOverlay");
    modal.innerText = text;
    modal.classList.add("active");
    overlay.classList.add("active");
  });
}



Object.entries(sliders).forEach(([id, options]) => createSlider(id, options));
