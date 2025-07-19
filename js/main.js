// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM загружен, инициализация...');

  const img = document.querySelector('.content_games_img');
  const arrow = document.querySelector('.arrow');
  const menuItems = document.querySelectorAll('.lesson-list li');
  const currentPage = window.location.pathname.split('/').pop();

  console.log('Текущая страница:', currentPage);
  console.log('Найденное изображение:', img);
  console.log('Найденная стрелка:', arrow);

  // Получаем номер текущего урока
  function getCurrentLessonNumber(page) {
    if (page === 'index.html') return 1;
    if (page === 'lesson0.html') return 0;

    const match = page.match(/lesson(\d+)(?:-\d+)?\.html/);
    return match ? parseInt(match[1]) : null;
  }

  const currentLesson = getCurrentLessonNumber(currentPage);

  // Подсветка активного пункта меню
  menuItems.forEach(item => {
    const href = item.getAttribute('data-href');

    const hrefMatch = href.match(/lesson(\d+)/);
    const hrefLesson = hrefMatch ? parseInt(hrefMatch[1]) : null;

    // Особый случай для index.html (урок 1)
    if (href === 'index.html' && currentLesson === 1) {
      item.classList.add('active');
    }
    // Обычные уроки
    else if (hrefLesson && currentLesson && hrefLesson === currentLesson) {
      item.classList.add('active');
    }
    // Точное совпадение страниц
    else if (href === currentPage) {
      item.classList.add('active');
    }

    item.addEventListener('click', () => {
      if (href) window.location.href = href;
    });
  });

  // Конфигурация каждого урока (для 5 класса)
  const lessonConfig = {
    0: { count: 3 }, // Введение: lesson0.html -> lesson0-2.html -> lesson0-3.html -> index.html
    1: { count: 8 }, // Урок 1: index.html -> lesson1-1.html -> ... -> lesson1-8.html -> lesson2.html
    2: { count: 9 }, // Урок 2: lesson2.html -> lesson2-1.html -> ... -> lesson2-9.html -> lesson3.html
    3: { count: 8 }, // Урок 3: lesson3.html -> lesson3-1.html -> ... -> lesson3-8.html -> lesson4.html
    4: { count: 2 }, // Урок 4: lesson4.html -> lesson4-2.html -> lesson4-3.html -> lesson5.html
    5: { count: 5 }, // Урок 5: lesson5.html -> lesson5-1.html -> ... -> lesson5-5.html -> lesson6.html
    6: { count: 7 }, // Урок 6: lesson6.html -> lesson6-1.html -> ... -> lesson6-7.html -> конец
  };

  // Функция для выполнения перехода
  function navigateToNext() {
    console.log('Выполняется переход с страницы:', currentPage);

    // Определяем переходы на основе текущей страницы
    if (currentPage === 'lesson0.html') {
      // С первой страницы введения переходим на вторую
      window.location.href = 'lesson0-2.html';
    } else if (currentPage === 'lesson0-2.html') {
      // Со второй страницы введения переходим на третью
      window.location.href = 'lesson0-3.html';
    } else if (currentPage === 'lesson0-3.html') {
      // С третьей страницы введения переходим к уроку 1
      window.location.href = 'index.html';
    } else if (currentPage === 'index.html') {
      // С главной страницы урока 1 переходим к первому заданию
      window.location.href = 'lesson1-1.html';
    } else if (currentPage === 'lesson4.html') {
      window.location.href = 'lesson4-2.html';
    } else if (currentPage === 'lesson4-2.html') {
      // Явный переход на следующую часть урока 4
      window.location.href = 'lesson4-3.html';
    } else if (currentPage === 'lesson5.html') {
      // Явный переход на следующую часть урока 4
      window.location.href = 'lesson5-2.html';
    } else if (currentPage === 'lesson6.html') {
      // Явный переход на следующую часть урока 4
      window.location.href = 'lesson6-2.html';
    } else {
      // Для остальных страниц используем конфигурацию
      const matchLessonTask = currentPage.match(/lesson(\d+)-(\d+)\.html/);
      const matchOnlyLesson = currentPage.match(/lesson(\d+)\.html/);

      let lesson = null;
      let task = null;

      if (matchLessonTask) {
        lesson = parseInt(matchLessonTask[1]);
        task = parseInt(matchLessonTask[2]);
      } else if (matchOnlyLesson) {
        lesson = parseInt(matchOnlyLesson[1]);
        task = 0; // Стартовая страница урока
      }

      if (lesson !== null) {
        const config = lessonConfig[lesson];
        if (!config) {
          alert('Урок не найден в конфигурации');
          return;
        }

        const nextTask = task + 1;

        if (task === 0) {
          // Стартовая страница урока
          window.location.href = `lesson${lesson}-1.html`;
        } else if (nextTask <= config.count) {
          // Обычные задания внутри урока
          window.location.href = `lesson${lesson}-${nextTask}.html`;
        } else {
          // Переход к следующему уроку
          const nextLesson = lesson + 1;
          const nextConfig = lessonConfig[nextLesson];

          if (nextConfig) {
            window.location.href = `lesson${nextLesson}.html`;
          } else {
            alert('Вы прошли все уроки 5 класса!');
          }
        }
      }
    }
  }

  // Переход по клику на изображение
  if (img) {
    img.addEventListener('click', e => {
      console.log('Клик по изображению');
      e.preventDefault();
      navigateToNext();
    });
  } else {
    console.log('Изображение не найдено!');
  }

  // Переход по клику на стрелку
  if (arrow) {
    arrow.addEventListener('click', e => {
      console.log('Клик по стрелке');
      e.preventDefault();
      e.stopPropagation();
      navigateToNext();
    });
  } else {
    console.log('Стрелка не найдена!');
  }

  // Дополнительный обработчик для всех элементов с классом arrow
  document.addEventListener('click', e => {
    if (
      e.target.classList.contains('arrow') ||
      e.target.classList.contains('yes-button')
    ) {
      console.log('Клик по стрелке через делегирование');
      e.preventDefault();
      e.stopPropagation();

      if (
        e.target.classList.contains('yes-button') &&
        currentPage === 'lesson0-2.html'
      ) {
        window.location.href = 'lesson0-3.html';
      } else {
        navigateToNext();
      }
    }
  });

  // Специальный обработчик для кнопки "Да" на lesson0-2.html
  const yesButton = document.querySelector('.yes-button');
  if (yesButton && currentPage === 'lesson0-2.html') {
    console.log("Найдена кнопка 'Да'");
    yesButton.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Клик по кнопке 'Да'");
      window.location.href = 'lesson0-3.html';
    });
  } else if (currentPage === 'lesson0-2.html') {
    console.log("Кнопка 'Да' не найдена на странице lesson0-2.html");
  }

  // Переключение между классами
  document.querySelectorAll('.switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-href');
      if (target) window.location.href = target;
    });
  });

  // Подсветка активной кнопки класса
  const classButtons = document.querySelectorAll('.switch-btn');
  classButtons.forEach(btn => btn.classList.remove('active'));

  // Определяем, какой класс активен (5 класс по умолчанию)
  const is5class =
    !currentPage.startsWith('2lesson') && currentPage !== '2index.html';

  classButtons.forEach(btn => {
    const href = btn.getAttribute('data-href');
    if (is5class && href === 'index.html') {
      btn.classList.add('active');
    } else if (!is5class && href === '2lesson.html') {
      btn.classList.add('active');
    }
  });

  // Обработчики для мини-игр и интерактивных элементов
  document.addEventListener('DOMContentLoaded', () => {
    let testPassed = false;

    const testForm = document.getElementById('testForm');
    const testResult = document.getElementById('testResult');
    const startTestBtn = document.getElementById('startTestBtn');
    const testBlock = document.getElementById('testBlock');

    // Показываем тест при клике
    if (startTestBtn && testBlock) {
      startTestBtn.addEventListener('click', () => {
        startTestBtn.style.display = 'none';
        testBlock.style.display = 'block';
        testBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Проверка теста
    if (testForm && testResult) {
      testForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Здесь будут правильные ответы для каждого конкретного теста
        const answers = {
          q1: '25',
          q2: 'no',
          q3: 'shock',
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
          testForm.style.display = 'none';
          testResult.style.display = 'block';
        } else {
          alert(
            `Ты ответил правильно на ${correct} из ${total} вопросов. Попробуй ещё раз.`
          );
        }
      });
    }

    // Переход к следующему уроку после теста
    const nextLessonBtn = document.getElementById('nextLessonBtn');
    if (nextLessonBtn) {
      nextLessonBtn.addEventListener('click', () => {
        if (!testPassed) {
          alert('Сначала пройди тест!');
          return;
        }

        const lessonMatch = currentPage.match(/lesson(\d+)/);
        const lessonNum = lessonMatch ? parseInt(lessonMatch[1]) : 1;
        const nextLesson = lessonNum + 1;
        const nextPage = `lesson${nextLesson}.html`;

        window.location.href = nextPage;
      });
    }
  });

  // Слайдеры для компонентов компьютера
  const sliders = {
    slider1: ['Процессор', 'Охлаждение', 'Радиатор'],
    slider2: ['Оперативная память', 'SSD', 'HDD'],
    slider3: ['Видеокарта', 'Сетевая карта', 'Звуковая карта'],
    slider4: ['Блок питания', 'UPS', 'Инвертор'],
    slider5: ['Материнская плата', 'Чипсет', 'BIOS'],
    slider6: ['Корпус', 'Кулеры', 'USB-порты'],
  };

  function createSlider(id, options) {
    const container = document.getElementById(id);
    if (!container) return;

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
    tooltipBtn.addEventListener('click', () => {
      const text = tooltips[id] || 'Описание недоступно.';
      const modal = document.getElementById('tooltipModal');
      const overlay = document.getElementById('tooltipOverlay');
      if (modal && overlay) {
        modal.innerText = text;
        modal.classList.add('active');
        overlay.classList.add('active');
      }
    });
  }
}); // Закрытие DOMContentLoaded

// Синхронизация высот меню и контента
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
