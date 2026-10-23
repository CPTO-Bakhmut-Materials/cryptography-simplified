// Український алфавіт для Демо №1А (Шифр Цезаря)
const UA_UPPER = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
const UA_LOWER = UA_UPPER.toLowerCase();

// Нотатки спікера для кожного з 15 повноцінних розділів (0..14)
const SPEAKER_NOTES = [
  "<strong>Розділ 1: Вступ — Сучасна криптографія та публічний Wi-Fi.</strong> Запитайте аудиторію: «Хто сьогодні вже користувався Telegram/Instagram або підключався до публічного Wi-Fi у кав’ярні чи коледжі?» Поясніть, що без криптографії сусід за столиком бачив би всі їхні повідомлення і паролі на екрані ноутбука.",
  "<strong>Розділ 2: Вступ — Відкрита листівка (HTTP) проти Сейфа (HTTPS).</strong> Інтернет проектувався як відкрита пошта: пакети летять через десятки чужих роутерів. Симетричне шифрування — це коли у вас і у друга однаковий ключ від залізного сейфа.",
  "<strong>Розділ 3 (Демо №1А): Симетричне шифрування — Класичний Шифр Цезаря.</strong> Попросіть студента з залу назвати будь-яку фразу. Натисніть «▶ Анімація розшифрування» (посимвольне відмотування назад), а потім «Перебір 32 ключів» — оскільки ключів усього 32, комп’ютер зламує шифр миттєво!",
  "<strong>Розділ 4 (Демо №1Б): Симетричне шифрування — Сучасний стандарт AES-256-GCM.</strong> Поясніть, що означає приставка <strong>GCM (Galois/Counter Mode)</strong>: 1) <em>Counter Mode</em> з унікальним вектором <code>IV</code> перетворює блоковий шифр на швидкий потоковий шифр; 2) <em>Galois Tag (16 байт у кінці пакета)</em> працює як криптографічна пломба цілісності (AEAD). Натисніть «😈 Пошкодити 1 байт шифротексту в мережі» або «Змінити 1 символ ключа» — пломба GCM миттєво виявляє втручання і блокує розшифрування!",
  "<strong>Розділ 5: Обмін ключами — Публічний замок та Приватний ключ.</strong> Як передати ключ через Інтернет, якщо канал прослуховується? Аналогія з відкритим навісним замком: Публічний ключ-замок роздаємо всім, а Приватний ключ тримаємо виключно на своєму пристрої.",
  "<strong>Розділ 6 (Демо №2А): Обмін ключами — Протокол Діффі-Геллмана та генерація ключа K.</strong> 1) Поясніть правило <code>(5^a)^b = (5^b)^a = 5^(a×b)</code> на малих числах (<code>3 × 5 = 5 × 3 = 15</code>), де хакер пасивно проглядає трафік (бачить відкриті пакети <code>A=10, B=20</code>) і не втручається в нього. 2) Покажіть, як після піднесення до степеня (<code>8000</code> і <code>100000</code>) залишок від ділення на 23 дає однаковий секрет <code>S = 19</code>, який через <code>K = SHA-256(S)</code> перетворюється на 256-бітний ключ для AES-256!",
  "<strong>Розділ 7 (Демо №2Б): Архітектура месенджерів — Хмарний чат проти Наскрізного шифрування (E2EE).</strong> Покажіть різницю між звичайним хмарним чатом (де сервер має ключі для синхронізації історії) та наскрізним шифруванням E2EE (Signal / WhatsApp / Secret Chat, де ключі живуть лише на телефонах співрозмовників).",
  "<strong>Розділ 8: Хешування та Паролі — Функція в один бік SHA-256 та Сіль (Salt).</strong> Поясніть аналогію з блендером і смузі (в один бік легко, назад неможливо). Далі обов’язково наголосіть: <strong>Сіль (Salt) зберігається в базі даних у відкритому вигляді (Plain Text)</strong> поруч із хешем! Навіщо вона потрібна, якщо вона не секретна? 1) Щоб у двох користувачів з однаковим паролем були абсолютно різні хеші в базі; 2) Щоб зламати готові райдужні таблиці (Rainbow Tables) — хакеру доведеться перебирати паролі заново під кожну унікальну сіль окремо.",
  "<strong>Розділ 9 (Демо №3): ЛАВИННИЙ ЕФЕКТ (Avalanche Effect) та Краш-тест паролів.</strong> Поясніть суть <strong>Лавинного ефекту</strong>: у криптографії зміна всього 1 біта або 1 символу у вхідному тексті («100 грн» → «900 грн» або крапка в кінці) викликає каскадну («лавинну») зміну щонайменше <strong>50% бітів та символів</strong> вихідного хешу SHA-256 (32+ із 64 hex-символів стають іншими). Навіщо це потрібно? 1) Неможливо вгадати пароль «тепліше-холодніше» за схожістю хешів; 2) Будь-яка підробка документа на 1 байт миттєво руйнує цифровий підпис. Далі протестуйте паролі залу та покажіть силу Passphrase з 4 слів (космос-піца-кактус-дрон).",
  "<strong>Розділ 10 (Демо №4А): Цифрові сертифікати — Електронний підпис документа (КЕП / Дія.Підпис).</strong> Поясніть два кроки: 1) <strong>Як створюється підпис:</strong> програма рахує хеш документа <code>H₁ = SHA-256(Текст)</code> і математично підписує цей хеш секретним <strong>Приватним ключем</strong> автора; 2) <strong>Як перевіряється підпис:</strong> отримувач сам рахує хеш отриманого тексту <code>H₂ = SHA-256(Текст)</code> і перевіряє прикріплений підпис відкритим <strong>Публічним ключем</strong> із сертифіката автора. Якщо змінити хоча б одну цифру (5000 → 50000 грн), через лавинний ефект <code>H₂ ≠ H₁</code>, і підпис миттєво стає недійсним!",
  "<strong>Розділ 11 (Демо №4Б): Цифрові сертифікати — Інспектор HTTPS-сертифікатів та Центри CA.</strong> Порівняйте 3 сертифікати: справжній банк (DigiCert), фішинговий сайт <code>instagrarn.com</code> (який теж має справжній замочок від безкоштовного Let’s Encrypt!) та самопідписаний сертифікат хакера у Wi-Fi, який блокується браузером.",
  "<strong>Розділ 12: Людський фактор — Чому атакують людей, а не математику.</strong> Поясніть міф про замочок HTTPS: шахраї теж ставлять безкоштовні сертифікати HTTPS на фішингові сайти! Замочок лише шифрує дорогу до шахрая, але не гарантує чесність власника домену.",
  "<strong>Розділ 13 (Демо №5): Інтерактивний квіз «Фішинг чи Оригінал?».</strong> Просіть студентів голосувати «Оригінал» чи «Пастка» на кожному з 4 кейсів (Instagram rn/m, Telegram голосування, Monobank банка, Steam омограф).",
  "<strong>Розділ 14: Захист акаунтів — Чим відрізняються SMS, 2FA-додаток, Хмарний пароль та Passkeys.</strong> 1) <strong>SMS vs 2FA-додаток (Authenticator):</strong> SMS летить через мобільного оператора і перехоплюється через перевипуск SIM-картки; натомість 2FA-додаток генерує 6 цифр офлайн на телефоні за формулою <code>SHA(Ключ + Час)</code> кожні 30 сек без участі SIM-картки. 2) <strong>Хмарний пароль</strong> — постійний другий пароль у месенджері поверх коду. 3) <strong>Passkey</strong> — ключ із біркою домену (<code>{Домен, Ключ}</code>), де немає цифр для вводу, тому фішинг неможливий.",
  "<strong>Розділ 15: Підсумки та Q&A — Фінальний чек-лист цифрової безпеки.</strong> Пройдіться по 5 пунктах захисту на сьогодні ввечері (Перевірити активні пристрої в Telegram, увімкнути Cloud Password, поставити менеджер паролів) і переходьте до запитань!"
];

// Повні назви всіх 15 розділів (без підрозділів/підвкладок)
const SLIDE_TITLES = [
  "1. Вступ: Сучасна криптографія та публічний Wi-Fi",
  "2. Вступ: Відкрита листівка (HTTP) проти Сейфа (HTTPS)",
  "3. Симетричне шифрування: Класичний Шифр Цезаря (Демо 1А)",
  "4. Симетричне шифрування: Сучасний стандарт AES-256-GCM (Демо 1Б)",
  "5. Обмін ключами: Публічний замок та Приватний ключ (Асиметрія)",
  "6. Обмін ключами: Протокол Діффі-Геллмана та генерація ключа K (Демо 2А)",
  "7. Архітектура месенджерів: Хмарний чат проти Наскрізного E2EE (Демо 2Б)",
  "8. Хешування та Паролі: Одностороння функція SHA-256 та Сіль",
  "9. Хешування та Паролі: Лавинний ефект та Стійкість паролів (Демо 3)",
  "10. Цифрові сертифікати: Електронний підпис документа КЕП (Демо 4А)",
  "11. Цифрові сертифікати: Інспектор HTTPS-сертифікатів та CA (Демо 4Б)",
  "12. Людський фактор: Чому атакують людей (Міф про HTTPS)",
  "13. Людський фактор: Інтерактивний квіз «Фішинг чи Оригінал?» (Демо 5)",
  "14. Захист акаунтів: Піраміда 2FA, Хмарний пароль та Passkeys (FIDO2)",
  "15. Підсумки та Q&A: Фінальний чек-лист цифрової безпеки"
];

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function initTopProgressStrip() {
  const strip = document.getElementById("topProgressStrip");
  if (!strip) return;
  strip.innerHTML = "";

  SLIDE_TITLES.forEach((title, idx) => {
    const seg = document.createElement("div");
    seg.className = "prog-seg";
    seg.setAttribute("data-target-slide", String(idx));
    seg.title = title;
    seg.addEventListener("click", () => {
      selectNavItem(idx);
    });
    strip.appendChild(seg);
  });
}

function openNavToast() {
  const backdrop = document.getElementById("navToastBackdrop");
  if (!backdrop) return;
  renderNavToastList();
  backdrop.classList.remove("hidden");
}

function closeNavToast(event) {
  if (event && event.target && event.target.id !== "navToastBackdrop") return;
  const backdrop = document.getElementById("navToastBackdrop");
  if (backdrop) backdrop.classList.add("hidden");
}

function selectNavItem(slideIdx) {
  goToSlide(slideIdx);
  closeNavToast();
}

function renderNavToastList() {
  const listEl = document.getElementById("navToastList");
  if (!listEl) return;

  listEl.innerHTML = SLIDE_TITLES.map((title, idx) => {
    const isActive = idx === currentSlide;
    const isDemo = title.includes("Демо");
    return `
      <button type="button" class="toast-section-btn ${isActive ? "active" : ""}" onclick="selectNavItem(${idx})">
        <span class="toast-section-name">${title}</span>
        <span class="toast-section-badge ${isDemo ? "demo" : ""}">${isDemo ? "Інтерактивне демо" : "Розділ " + (idx + 1)}</span>
      </button>
    `;
  }).join("");
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = index;
  slides[currentSlide].classList.add("active");

  const curNumEl = document.getElementById("currentSlideNum");
  const totNumEl = document.getElementById("totalSlidesNum");
  const hintEl = document.getElementById("currentSlideHint");
  if (curNumEl) curNumEl.textContent = currentSlide + 1;
  if (totNumEl) totNumEl.textContent = totalSlides;
  if (hintEl) hintEl.textContent = `— ${SLIDE_TITLES[currentSlide]}`;

  updateBottomBarFit();
  updateTopBarIndicators();

  const noteEl = document.getElementById("speakerNoteContent");
  if (noteEl) noteEl.innerHTML = SPEAKER_NOTES[currentSlide] || "";

  clearTerminal();
  updateCliSuggestionForSlide(currentSlide);
  syncActiveSlideBoxMode("diagram");
}

function updateBottomBarFit() {
  const bottomNav = document.getElementById("bottomNav");
  const slideCounter = document.getElementById("slideCounter");
  if (!bottomNav || !slideCounter) return;

  // Спочатку вмикаємо повний режим, щоб виміряти реальну ширину тексту в один рядок
  bottomNav.classList.remove("compact");

  // Якщо центральний текст ширший за доступний контейнер (не влазить в 1 рядок) — перемикаємо у компактний режим (лише "N / 15" та стрілки "←" / "→")
  if (slideCounter.scrollWidth > slideCounter.clientWidth) {
    bottomNav.classList.add("compact");
  }
}

window.addEventListener("resize", updateBottomBarFit);

function updateTopBarIndicators() {
  document.querySelectorAll("#topProgressStrip .prog-seg").forEach((seg) => {
    const segSlide = parseInt(seg.getAttribute("data-target-slide"), 10);
    seg.classList.toggle("active", segSlide === currentSlide);
    seg.classList.toggle("passed", segSlide < currentSlide);
  });

  renderNavToastList();
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
}

function prevSlide() {
  if (currentSlide > 0) goToSlide(currentSlide - 1);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeNavToast();
    return;
  }

  const tag = document.activeElement ? document.activeElement.tagName : "";
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (e.key === "ArrowRight" || e.key === "PageDown") {
    nextSlide();
  } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
    prevSlide();
  } else if (e.key.toLowerCase() === "m" || e.key.toLowerCase() === "ь") {
    const backdrop = document.getElementById("navToastBackdrop");
    if (backdrop && backdrop.classList.contains("hidden")) {
      openNavToast();
    } else {
      closeNavToast();
    }
  } else if (e.key.toLowerCase() === "n" || e.key.toLowerCase() === "т") {
    toggleSpeakerNotes();
  } else if (e.key.toLowerCase() === "f" || e.key.toLowerCase() === "а") {
    toggleFullscreen();
  }
});

function toggleSpeakerNotes() {
  const drawer = document.getElementById("speakerDrawer");
  if (drawer) drawer.classList.toggle("hidden");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

/* ============================================================================
   ДЕМО №1А та №1Б: Шифр Цезаря та AES-256-GCM
   ============================================================================ */
function caesarTransform(text, shift) {
  const n = UA_UPPER.length; // 33
  const s = ((shift % n) + n) % n;
  let out = "";
  for (const ch of text) {
    const idxU = UA_UPPER.indexOf(ch);
    const idxL = UA_LOWER.indexOf(ch);
    if (idxU !== -1) {
      out += UA_UPPER[(idxU + s) % n];
    } else if (idxL !== -1) {
      out += UA_LOWER[(idxL + s) % n];
    } else {
      out += ch;
    }
  }
  return out;
}

let caesarAnimTimer = null;

function stopCaesarAnimation() {
  if (caesarAnimTimer) {
    clearTimeout(caesarAnimTimer);
    caesarAnimTimer = null;
  }
  const statusEl = document.getElementById("caesarAnimStatus");
  if (statusEl) statusEl.classList.add("hidden");
  const btn = document.getElementById("btnAnimateCaesar");
  if (btn) btn.textContent = "▶ Анімація розшифрування";
}

function renderCaesarSpans(text) {
  const outEl = document.getElementById("caesarOutput");
  if (!outEl) return;
  outEl.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    const sp = document.createElement("span");
    sp.className = "caesar-char";
    sp.textContent = text[i];
    outEl.appendChild(sp);
  }
}

function updateCaesar() {
  stopCaesarAnimation();
  const text = document.getElementById("caesarInput").value;
  const shift = parseInt(document.getElementById("caesarShift").value, 10);
  document.getElementById("caesarShiftVal").textContent = `+${shift}`;

  const encrypted = caesarTransform(text, shift);
  renderCaesarSpans(encrypted);

  // Оновити прев'ю колеса алфавіту (перші 12 літер для наочності)
  const wheel = document.getElementById("alphabetPreview");
  wheel.innerHTML = "";
  for (let i = 0; i < 12; i++) {
    const orig = UA_UPPER[i];
    const enc = UA_UPPER[(i + shift) % UA_UPPER.length];
    const div = document.createElement("div");
    div.className = "alpha-pair";
    div.innerHTML = `${orig}→<b>${enc}</b>`;
    wheel.appendChild(div);
  }
}

function animateCaesarDecryption() {
  if (caesarAnimTimer) {
    updateCaesar();
    return;
  }

  const plainText = document.getElementById("caesarInput").value;
  const shift = parseInt(document.getElementById("caesarShift").value, 10);
  const cipherText = caesarTransform(plainText, shift);
  renderCaesarSpans(cipherText);

  const outEl = document.getElementById("caesarOutput");
  const spans = outEl ? Array.from(outEl.querySelectorAll(".caesar-char")) : [];
  const statusEl = document.getElementById("caesarAnimStatus");
  const btn = document.getElementById("btnAnimateCaesar");

  if (btn) btn.textContent = "⏹ Скинути";
  if (statusEl) {
    statusEl.classList.remove("hidden");
    statusEl.textContent = `Застосовуємо зворотний ключ -${shift}...`;
  }

  let charIdx = 0;
  let stepBack = 0;

  function stepAnimation() {
    if (charIdx >= spans.length) {
      caesarAnimTimer = null;
      if (statusEl) {
        statusEl.textContent = `✅ Розшифровано посимвольно (зсув кожного символу на -${shift} позицій назад)!`;
      }
      if (btn) btn.textContent = "↻ Повторити анімацію";
      return;
    }

    const sp = spans[charIdx];
    const origCipherChar = cipherText[charIdx];
    const isUaLetter =
      UA_UPPER.indexOf(origCipherChar) !== -1 || UA_LOWER.indexOf(origCipherChar) !== -1;

    // Якщо це пробіл, цифра чи розділовий знак — одразу переходимо до наступного символу
    if (!isUaLetter) {
      sp.classList.add("done-decrypt");
      charIdx++;
      stepBack = 0;
      caesarAnimTimer = setTimeout(stepAnimation, 55);
      return;
    }

    sp.classList.add("active-decrypt");
    stepBack++;

    // Проміжна літера при зворотному відмотуванні алфавіту (для великих ключів робимо плавні кроки)
    const maxVisualSteps = Math.min(shift, 5);
    const currentShiftBack =
      stepBack >= maxVisualSteps
        ? shift
        : Math.max(1, Math.round((stepBack / maxVisualSteps) * shift));

    const intermediateChar = caesarTransform(origCipherChar, -currentShiftBack);
    sp.textContent = intermediateChar;

    if (statusEl) {
      statusEl.textContent = `Символ [${charIdx + 1}/${spans.length}]: «${origCipherChar}» ──(зсув -${currentShiftBack})──► «${intermediateChar}»`;
    }

    if (stepBack >= maxVisualSteps) {
      sp.classList.remove("active-decrypt");
      sp.classList.add("done-decrypt");
      charIdx++;
      stepBack = 0;
      caesarAnimTimer = setTimeout(stepAnimation, 160);
    } else {
      caesarAnimTimer = setTimeout(stepAnimation, 95);
    }
  }

  stepAnimation();
}

function bruteForceCaesar() {
  stopCaesarAnimation();
  const plainText = document.getElementById("caesarInput").value;
  const correctShift = parseInt(document.getElementById("caesarShift").value, 10);
  const cipherText = caesarTransform(plainText, correctShift);
  renderCaesarSpans(cipherText);
  const listEl = document.getElementById("caesarBruteList");
  listEl.innerHTML = "";

  for (let k = 1; k < UA_UPPER.length; k++) {
    const candidate = caesarTransform(cipherText, -k);
    const row = document.createElement("div");
    row.className = "brute-line" + (k === correctShift ? " match" : "");
    row.textContent = `Ключ -${String(k).padStart(2, "0")}: ${candidate}`;
    listEl.appendChild(row);
    if (k === correctShift) {
      setTimeout(() => row.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    }
  }
}

// Справжній AES-256-GCM через Web Crypto API
let currentAESData = { iv: null, ciphertext: null };

async function deriveAESKey(password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password.padEnd(16, "0")),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("cyber-lecture-salt-ua"),
      iterations: 1000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

let aesTampered = false;

function renderAESPacketHex(iv, cipherBuf, isTampered = false) {
  const fullBytes = new Uint8Array(cipherBuf);
  const tagOffset = Math.max(0, fullBytes.length - 16);
  const bodyHex = bufToHex(fullBytes.slice(0, tagOffset));
  const tagHex = bufToHex(fullBytes.slice(tagOffset));
  const ivHex = bufToHex(iv);
  const outEl = document.getElementById("aesOutputHex");
  if (!outEl) return;
  outEl.innerHTML =
    `<div><span style="color:#64748B">IV (12Б):</span> ${ivHex}</div>` +
    `<div><span style="color:#1A73E8">Шифротекст:</span> ${isTampered ? "<span class=\"hash-char-diff\">" + bodyHex.slice(0, 2) + "</span>" + bodyHex.slice(2) : bodyHex}</div>` +
    `<div><span style="color:#188038;font-weight:700">Пломба GCM-Tag (16Б):</span> ${tagHex}</div>`;
}

async function runAESDemo() {
  aesTampered = false;
  const btnTamper = document.getElementById("btnTamperAES");
  if (btnTamper) btnTamper.textContent = "😈 Пошкодити 1 байт шифротексту в мережі";

  const plain = document.getElementById("aesInput").value;
  const keyStr = document.getElementById("aesKey").value;
  const enc = new TextEncoder();

  const digest = await crypto.subtle.digest("SHA-256", enc.encode(keyStr + "::iv"));
  const iv = new Uint8Array(digest).slice(0, 12);

  const key = await deriveAESKey(keyStr);
  const encryptedBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plain));

  currentAESData = { iv, origCiphertext: encryptedBuf, ciphertext: encryptedBuf };
  renderAESPacketHex(iv, encryptedBuf, false);
  await tryDecryptAES();
}

function tamperAESCiphertext() {
  if (!currentAESData.origCiphertext) return;
  aesTampered = !aesTampered;
  const btnTamper = document.getElementById("btnTamperAES");
  if (aesTampered) {
    const copy = new Uint8Array(currentAESData.origCiphertext.slice(0));
    copy[0] ^= 0xff;
    currentAESData.ciphertext = copy.buffer;
    if (btnTamper) btnTamper.textContent = "↩ Відновити оригінальний шифротекст";
  } else {
    currentAESData.ciphertext = currentAESData.origCiphertext;
    if (btnTamper) btnTamper.textContent = "😈 Пошкодити 1 байт шифротексту в мережі";
  }
  renderAESPacketHex(currentAESData.iv, currentAESData.ciphertext, aesTampered);
  tryDecryptAES();
}

async function tryDecryptAES() {
  const decKeyStr = document.getElementById("aesDecryptKey").value;
  const statusEl = document.getElementById("aesDecryptResult");
  if (!currentAESData.ciphertext) return;

  try {
    const key = await deriveAESKey(decKeyStr);
    const decryptedBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: currentAESData.iv },
      key,
      currentAESData.ciphertext
    );
    const text = new TextDecoder().decode(decryptedBuf);
    statusEl.className = "decrypt-status success";
    statusEl.textContent = `✅ Пломба GCM ціла! Розшифровано: «${text}»`;
  } catch (err) {
    statusEl.className = "decrypt-status error";
    statusEl.textContent = aesTampered
      ? "❌ ПЛОМБУ GCM ЗІРВАНО! У мережі змінено 1 байт шифротексту — контрольний тег Галуа (16 байт) не зійшовся, пакет відхилено!"
      : "❌ Помилка автентифікації AES-GCM! Ключ не підходить навіть на 1 символ — пломба GCM не зійшлася, розшифрування заблоковано.";
  }
}

function mutateAESKey() {
  const input = document.getElementById("aesDecryptKey");
  const origKey = document.getElementById("aesKey").value;
  if (input.value === origKey) {
    input.value = origKey.slice(0, -1) + (origKey.endsWith("X") ? "Y" : "X");
  } else {
    input.value = origKey;
  }
  tryDecryptAES();
}

/* ============================================================================
   ДЕМО №2: Обмін ключами Діффі-Геллмана (Кольори) + Симулятор чату E2EE
   ============================================================================ */
function modPow(base, exp, mod) {
  let res = 1n;
  let b = BigInt(base) % BigInt(mod);
  let e = BigInt(exp);
  const m = BigInt(mod);
  while (e > 0n) {
    if (e % 2n === 1n) res = (res * b) % m;
    b = (b * b) % m;
    e /= 2n;
  }
  return Number(res);
}

async function updateDHColors() {
  const g = 5;
  const p = 23;
  const aInput = document.getElementById("aliceSecretNum");
  const bInput = document.getElementById("bobSecretNum");
  if (!aInput || !bInput) return;

  const a = parseInt(aInput.value, 10) || 3;
  const b = parseInt(bInput.value, 10) || 5;

  // Крок 1: Відкриті пакети A та B
  const gPowA = Math.pow(g, a);
  const gPowB = Math.pow(g, b);
  const A = modPow(g, a, p);
  const B = modPow(g, b, p);

  // Крок 2: Піднесення до степеня у Аліси (B^a) і у Боба (A^b) та взяття залишку mod 23 -> спільне число S
  const aliceRawPow = BigInt(B) ** BigInt(a);
  const bobRawPow = BigInt(A) ** BigInt(b);
  const aliceQuot = aliceRawPow / 23n;
  const bobQuot = bobRawPow / 23n;
  const aliceS = modPow(B, a, p);
  const bobS = modPow(A, b, p);

  // Хибна спроба пасивного хакера
  const hackerProd = A * B;
  const hackerWrongS = hackerProd % p;

  document.getElementById("aliceSecretVal").textContent = "a = " + a;
  document.getElementById("bobSecretVal").textContent = "b = " + b;

  document.getElementById("alicePublicCalc").textContent = "5^" + a + " = " + gPowA + " ──► " + gPowA + " mod 23 = " + A;
  document.getElementById("bobPublicCalc").textContent = "5^" + b + " = " + gPowB + " ──► " + gPowB + " mod 23 = " + B;

  document.getElementById("alicePowerStep").textContent = "Степінь: B^a = " + B + "^" + a + " = " + aliceRawPow.toString();
  document.getElementById("bobPowerStep").textContent = "Степінь: A^b = " + A + "^" + b + " = " + bobRawPow.toString();

  document.getElementById("aliceModStep").textContent = "Залишок S: " + aliceRawPow.toString() + " = 23×" + aliceQuot.toString() + " + " + aliceS + " ──► S = " + aliceS;
  document.getElementById("bobModStep").textContent = "Залишок S: " + bobRawPow.toString() + " = 23×" + bobQuot.toString() + " + " + bobS + " ──► S = " + bobS;

  // Крок 3: Перетворення спільного залишку S у 256-бітний ключ K через KDF (SHA-256)
  const realKeyHex = (await sha256Hex("dh-secret-" + aliceS)).toUpperCase();
  const hackKeyHex = (await sha256Hex("dh-secret-" + hackerWrongS)).toUpperCase();
  const shortK = realKeyHex.slice(0, 6) + "..." + realKeyHex.slice(-4);
  const shortHackK = hackKeyHex.slice(0, 6) + "..." + hackKeyHex.slice(-4);

  document.getElementById("aliceFinalHex").textContent = "Залишок S = " + aliceS + " ──► Ключ K = " + shortK;
  document.getElementById("bobFinalHex").textContent = "Залишок S = " + bobS + " ──► Ключ K = " + shortK;

  document.getElementById("hackerAliceMix").textContent = "A = " + A + " (степінь a невідомий)";
  document.getElementById("hackerBobMix").textContent = "B = " + B + " (степінь b невідомий)";
  document.getElementById("hackerWrongHex").textContent = "Пробує A×B mod 23: " + A + "×" + B + " = " + hackerProd + " mod 23 = " + hackerWrongS;
  document.getElementById("hackerFailReason").textContent =
    hackerWrongS === aliceS
      ? "⚠️ Випадковий збіг на малому mod 23 (у реальному DH p має 600 цифр!)"
      : "❌ Отримав S = " + hackerWrongS + " замість " + aliceS + " (без a і b не можна обчислити B^a mod 23!)";

  const fakeCipher = realKeyHex.slice(8, 12) + "..." + realKeyHex.slice(16, 20);
  const encEl = document.getElementById("dhUseAliceEnc");
  const cipEl = document.getElementById("dhUseCipherHex");
  const hackTryEl = document.getElementById("dhUseHackerTry");
  const hackFailEl = document.getElementById("dhUseHackerFail");
  const bobDecEl = document.getElementById("dhUseBobDec");
  if (encEl) encEl.textContent = "K = SHA-256(S=" + aliceS + ") = " + shortK;
  if (cipEl) cipEl.textContent = "Аліса шифрує AES(K): 🔒 " + fakeCipher;
  if (hackTryEl) hackTryEl.textContent = "K_hack = SHA-256(S=" + hackerWrongS + ") = " + shortHackK;
  if (hackFailEl) {
    hackFailEl.textContent =
      hackerWrongS === aliceS
        ? "⚠️ Збіг на малому mod 23 (при 2048-бітному p шанс збігу = 0)"
        : "❌ Лавинний ефект SHA-256 дав інший ключ K_hack — AES заблоковано!";
  }
  if (bobDecEl) bobDecEl.textContent = "K = SHA-256(S=" + bobS + ") = " + shortK;
}

// Частина Б: Симулятор чату (Хмарний vs E2EE)
let chatArchitecture = "cloud";

function setChatArchitecture(arch) {
  chatArchitecture = arch;
  const isCloud = arch === "cloud";
  document.getElementById("archCloudBtn").classList.toggle("active", isCloud);
  document.getElementById("archE2EBtn").classList.toggle("active", !isCloud);
  simulateSendMessage();
}

async function simulateSendMessage() {
  const msg = document.getElementById("chatMsgInput").value;
  const serverStatus = document.getElementById("serverKeyStatus");
  const serverPayload = document.getElementById("serverPayloadView");
  const serverExplain = document.getElementById("serverExplainText");
  const senderBadge = document.getElementById("senderKeyBadge");
  const receiverBadge = document.getElementById("receiverKeyBadge");
  const receiverView = document.getElementById("receiverMsgView");

  if (chatArchitecture === "cloud") {
    senderBadge.textContent = "🔑 Клієнт ↔ Сервер";
    receiverBadge.textContent = "🔑 Сервер ↔ Клієнт";
    serverStatus.textContent = "⚠️ Сервер має ключі";
    serverStatus.style.color = "#D93025";
    serverPayload.textContent = `Відкритий текст: "${msg}"`;
    serverPayload.style.color = "#D93025";
    serverExplain.textContent =
      "Повідомлення доступні серверу для хмарної синхронізації.";
    receiverView.textContent = msg;
  } else {
    senderBadge.textContent = "🔒 Ключ тільки на пристрої";
    receiverBadge.textContent = "🔒 Розшифровано локально";
    serverStatus.textContent = "✅ Сервер не має ключів";
    serverStatus.style.color = "#188038";

    const enc = new TextEncoder().encode(msg);
    const hashBuf = await crypto.subtle.digest("SHA-256", enc);
    const cipherPreview = bufToHex(hashBuf).slice(0, 40) + "...";

    serverPayload.textContent = `Зашифровано: ${cipherPreview}`;
    serverPayload.style.color = "#1A73E8";
    serverExplain.textContent =
      "Сервер передає лише зашифровані байти і не може прочитати вміст.";
    receiverView.textContent = msg;
  }
}

/* ============================================================================
   ДЕМО №3: Хешування SHA-256 (Лавинний ефект) + Краш-тест паролів
   ============================================================================ */
async function sha256Hex(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return bufToHex(hash);
}

async function compareHashes() {
  const t1 = document.getElementById("hashInput1").value;
  const t2 = document.getElementById("hashInput2").value;

  const h1 = await sha256Hex(t1);
  const h2 = await sha256Hex(t2);

  document.getElementById("hashOut1").textContent = h1;

  let diffCount = 0;
  let html2 = "";
  for (let i = 0; i < h2.length; i++) {
    if (h1[i] !== h2[i]) {
      diffCount++;
      html2 += `<span class="hash-char-diff">${h2[i]}</span>`;
    } else {
      html2 += h2[i];
    }
  }
  document.getElementById("hashOut2").innerHTML = html2;
  const pct = Math.round((diffCount / h2.length) * 100);
  document.getElementById("hashDiffPercent").textContent = `${diffCount} з 64 символів (${pct}%)`;
}

function setSameHashInputs() {
  document.getElementById("hashInput2").value = document.getElementById("hashInput1").value;
  compareHashes();
}

function flipOneCharHash() {
  const base = document.getElementById("hashInput1").value;
  const second = document.getElementById("hashInput2");
  if (second.value === base) {
    second.value = base + "!";
  } else {
    second.value = base.replace("100", "900");
  }
  compareHashes();
}

// Краш-тест паролів
const LEAKED_PATTERNS = [
  "123456",
  "12345678",
  "123456789",
  "qwerty",
  "qwerty123",
  "qwerty12345",
  "password",
  "p@ssw0rd",
  "p@ssw0rd!",
  "ukraina",
  "olesia2008",
  "ivan2007",
  "admin123"
];

function testPresetPwd(pwd) {
  document.getElementById("pwdTestInput").value = pwd;
  evaluatePassword();
}

function evaluatePassword() {
  const pwd = document.getElementById("pwdTestInput").value;
  const len = pwd.length;
  document.getElementById("pwdLenStat").textContent = `${len} симв.`;

  const lower = pwd.toLowerCase();
  const isLeaked = LEAKED_PATTERNS.some((p) => lower === p || (lower.includes(p) && len <= 12));

  // Оцінка розміру алфавіту
  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/[а-яіїєґ]/.test(pwd)) pool += 33;
  if (/[А-ЯІЇЄҐ]/.test(pwd)) pool += 33;
  if (/[0-9]/.test(pwd)) pool += 10;
  if (/[^a-zA-Zа-яіїєґА-ЯІЇЄҐ0-9]/.test(pwd)) pool += 32;

  const entropy = len > 0 && pool > 0 ? Math.round(len * Math.log2(pool)) : 0;
  document.getElementById("pwdEntropyStat").textContent = `${entropy} біт`;

  const bar = document.getElementById("pwdStrengthBar");
  const timeEl = document.getElementById("crackTimeDisplay");
  const verdictEl = document.getElementById("crackVerdict");

  if (len === 0) {
    bar.style.width = "0%";
    timeEl.textContent = "—";
    verdictEl.textContent = "Введіть пароль для перевірки.";
    return;
  }

  if (isLeaked || len < 7) {
    bar.style.width = "15%";
    bar.style.background = "#D93025";
    timeEl.style.color = "#D93025";
    timeEl.textContent = "⚡ Миттєво (0.0001 сек)";
    verdictEl.textContent = "У словнику злитих паролів — зламується в першу секунду.";
  } else if (entropy < 52) {
    bar.style.width = "45%";
    bar.style.background = "#B06000";
    timeEl.style.color = "#B06000";
    timeEl.textContent = "⏱️ Кілька хвилин";
    verdictEl.textContent = "Короткий пароль, вразливий до перебору на відеокартах.";
  } else if (entropy < 78) {
    bar.style.width = "75%";
    bar.style.background = "#1A73E8";
    timeEl.style.color = "#1A73E8";
    timeEl.textContent = "🛡️ ~450 років";
    verdictEl.textContent = "Надійний пароль за умови, що він унікальний.";
  } else {
    bar.style.width = "100%";
    bar.style.background = "#188038";
    timeEl.style.color = "#188038";
    timeEl.textContent = "🌌 Трильйони років";
    verdictEl.textContent = "Ідеально: парольна фраза з 4 слів (Passphrase).";
  }
}

/* ============================================================================
   ДЕМО №4: СЕРТИФІКАТИ HTTPS ТА ЕЛЕКТРОННИЙ ПІДПИС ДОКУМЕНТА (КЕП / ECDSA P-256)
   ============================================================================ */
let ecdsaKeyPair = null;
let currentDocSignature = null;

async function ensureEcdsaKeyPair() {
  if (!ecdsaKeyPair) {
    ecdsaKeyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    );
  }
  return ecdsaKeyPair;
}

async function signDocumentNow() {
  const kp = await ensureEcdsaKeyPair();
  const docText = document.getElementById("docSignInput").value;
  const enc = new TextEncoder().encode(docText);

  const hashHex = await sha256Hex(docText);
  document.getElementById("docCurrentHash").textContent = hashHex;

  currentDocSignature = await crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    kp.privateKey,
    enc
  );

  const sigHex = bufToHex(currentDocSignature);
  document.getElementById("docSignatureHex").textContent = sigHex.slice(0, 64) + "... (ECDSA P-256)";
  await verifySignedDocument();
}

async function verifySignedDocument() {
  const kp = await ensureEcdsaKeyPair();
  const docText = document.getElementById("docSignInput").value;
  const enc = new TextEncoder().encode(docText);

  const hashHex = await sha256Hex(docText);
  document.getElementById("docCurrentHash").textContent = hashHex;

  if (!currentDocSignature) return;

  const isValid = await crypto.subtle.verify(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    kp.publicKey,
    currentDocSignature,
    enc
  );

  const statusEl = document.getElementById("docVerifyStatus");
  if (isValid) {
    statusEl.className = "decrypt-status success";
    statusEl.textContent = "✅ КЕП ДІЙСНИЙ: Особистий сертифікат підтверджено, документ не змінювався після підписання.";
  } else {
    statusEl.className = "decrypt-status error";
    statusEl.textContent =
      "❌ ПІДПИС НЕДІЙСНИЙ! Документ було змінено після підписання — новий SHA-256 хеш не відповідає цифровому підпису!";
  }
}

function tamperDocumentNow() {
  const area = document.getElementById("docSignInput");
  if (area.value.includes("5000 грн")) {
    area.value = area.value.replace("5000 грн", "50000 грн");
  } else {
    area.value = "НАКАЗ №42: Виплатити студенту Коваленку О. І. грант у розмірі 5000 грн.";
  }
  verifySignedDocument();
}

const HTTPS_CERTS_DATA = {
  bank: {
    btnId: "certBtnBank",
    fields: [
      ["Кому видано (Common Name / CN):", "monobank.ua"],
      ["Організація (O):", "JSC UNIVERSAL BANK (Україна)"],
      ["Ким видано (Issuer CA):", "DigiCert Global G2 TLS RSA SHA256"],
      ["Алгоритм публічного ключа:", "ECDSA P-256 (256 біт)"],
      ["Статус підпису CA:", "✅ Довірений кореневий центр"]
    ],
    verdictClass: "decrypt-status success",
    verdictText: "✅ СПРАВЖНІЙ БАНК: Сертифікат видано перевіреним центром сертифікації на справжній домен monobank.ua.",
    explain:
      "Браузер перевірив цифровий підпис центру сертифікації DigiCert. Ніхто у кав'ярні не може підмінити цей сертифікат, бо не має приватного ключа DigiCert."
  },
  phish: {
    btnId: "certBtnPhish",
    fields: [
      ["Кому видано (Common Name / CN):", "instagrarn.com (⚠️ r+n замість m!)"],
      ["Організація (O):", "Не вказано (Domain Validation — DV)"],
      ["Ким видано (Issuer CA):", "Let's Encrypt (R3) — Безкоштовний CA"],
      ["Алгоритм публічного ключа:", "RSA 2048 біт"],
      ["Статус підпису CA:", "✅ Справжній замочок HTTPS!"]
    ],
    verdictClass: "decrypt-status error",
    verdictText:
      "🎭 ПАСТКА ЗІ СПРАВЖНІМ ЗАМОЧКОМ HTTPS! Сертифікат дійсний, але виданий на фейковий домен шахрая instagrarn.com!",
    explain:
      "Центр Let's Encrypt автоматично і безкоштовно видає сертифікат будь-кому, хто володіє доменом. Шахрай купив домен instagrarn.com за $2 і отримав справжній замочок HTTPS за 30 секунд."
  },
  mitm: {
    btnId: "certBtnMitm",
    fields: [
      ["Кому видано (Common Name / CN):", "monobank.ua (Спроба підробки)"],
      ["Організація (O):", "Unknown Hacker Wi-Fi Router"],
      ["Ким видано (Issuer CA):", "Self-Signed (Підписано самим хакером)"],
      ["Алгоритм публічного ключа:", "RSA 2048 біт"],
      ["Статус підпису CA:", "❌ НЕМАЄ В РЕЄСТРІ ДОВІРИ ОС!"]
    ],
    verdictClass: "decrypt-status error",
    verdictText:
      "🚨 АТАКУ ЗАБЛОКОВАНО БРАУЗЕРОМ (ERR_CERT_AUTHORITY_INVALID): Хакер у Wi-Fi намагався підсунути власний ключ!",
    explain:
      "Коли роутер-шпигун намагається прикинутися банком і підсовує свій публічний ключ, браузер бачить, що сертифікат не підписаний жодним офіційним Центром сертифікації (CA), і блокує вхід червоним екраном."
  }
};

function inspectHttpsCert(key) {
  const data = HTTPS_CERTS_DATA[key];
  ["certBtnBank", "certBtnPhish", "certBtnMitm"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active", id === data.btnId);
  });

  const listEl = document.getElementById("httpsCertDetails");
  if (listEl) {
    listEl.innerHTML = data.fields
      .map(([k, v]) => `<div class="cert-field-row"><span>${k}</span><strong>${v}</strong></div>`)
      .join("");
  }

  const vEl = document.getElementById("httpsCertVerdict");
  if (vEl) {
    vEl.className = data.verdictClass;
    vEl.textContent = data.verdictText;
  }

  const expEl = document.getElementById("httpsCertExplain");
  if (expEl) expEl.textContent = data.explain;
}

/* ============================================================================
   ДЕМО №5: Інтерактивний Квіз «Фішинг чи Оригінал?»
   ============================================================================ */
const QUIZ_CASES = [
  {
    category: "Кейс 1 з 4 • Instagram",
    domain: "instagrarn.com",
    path: "/accounts/login",
    title: "Повідомлення у Direct: «Твій акаунт отримав скаргу, підтвердь вхід»",
    desc: "Ти переходиш за посиланням, бачиш знайомий дизайн Instagram і зелений замочок HTTPS у браузері.",
    preview: "📸 Введіть логін та пароль від Instagram для скасування блокування акаунту...",
    isSafe: false,
    expTitle: "🚨 ПАСТКА! Класичний тайпсквотинг (rn замість m)",
    expText:
      "Подивіться уважно на домен: замість літери «m» там написано дві літери «r» + «n» (instagrarn.com). А замочок HTTPS шахрай отримав безкоштовно за 30 секунд!"
  },
  {
    category: "Кейс 2 з 4 • Telegram",
    domain: "t-me.contest-dance-ua.org",
    path: "/vote/ania",
    title: "Подруга пише в Telegram: «Привіт! Проголосуй, будь ласка, за племінницю в конкурсі!»",
    desc: "На сайті натискаєш кнопку «Голосувати через Telegram», сайт просить ввести твій номер телефону та 5-значний код, який прийшов у Telegram.",
    preview: "💃 Конкурс юних талантів • Введіть номер телефону +380... та код підтвердження з Telegram",
    isSafe: false,
    expTitle: "🚨 НАЙМАСОВІША ПАСТКА В УКРАЇНІ! Викрадення сесії Telegram",
    expText:
      "Як тільки ви введете 5-значний код на цьому сайті, скрипт шахрая миттєво ввійде у ваш реальний Telegram з іншого пристрою і почне розсилати це ж повідомлення всім вашим друзям! Офіційний домен Telegram — лише telegram.org або t.me (з крапкою, а не дефісом!)."
  },
  {
    category: "Кейс 3 з 4 • Monobank Банка",
    domain: "send.monobank.ua",
    path: "/jar/7XkP91mQa2",
    title: "Друг із коледжу збирає на подарунок викладачу або донат на ЗСУ",
    desc: "Посилання відкриває сторінку поповнення Банки через Apple Pay / Google Pay.",
    preview: "🐈 На Банку • Збір на дрони • Поповнити через Apple Pay / Картку",
    isSafe: true,
    expTitle: "✅ ОРИГІНАЛ! Це справжній домен Monobank",
    expText:
      "Головний домен перед першим слешем `/` — це справжній `monobank.ua` (а `send.` — його офіційний піддомен для банок). Але завжди остерігайтеся фейків на кшталт `send-monobank.top` або `monobank.ua.pay-prize.com`!"
  },
  {
    category: "Кейс 4 з 4 • Steam Безкоштовний Скін (IDN Homograph Attack)",
    domain: "stеampowered.com (xn--stampowered-tbb.com)",
    path: "/tradeoffer/new",
    title: "Тобі кидають посилання в Discord на роздачу рідкісного скіна в CS2",
    desc: "Адреса виглядає як steampowered.com, але літера «е» в ній — кирилична (українська/російська), яку браузер перетворює на Punycode.",
    preview: "🎮 Steam Community • Увійдіть у свій акаунт, щоб забрати подарунковий ніж...",
    isSafe: false,
    expTitle: "🚨 ПАСТКА! Атака омографів (підміна латинської літери кириличною)",
    expText:
      "Для ока людини латинська «e» та кирилична «е» абсолютно однакові, але для Інтернету це зовсім інший сайт (`xn--stampowered-tbb.com`). Саме тому найкращий захист — менеджер паролів або Passkey: він ніколи не підставить пароль на чужий домен!"
  }
];

let currentQuizIdx = 0;
let quizScore = 0;

function renderQuizCase() {
  const c = QUIZ_CASES[currentQuizIdx];
  document.getElementById("quizCurrentNum").textContent = currentQuizIdx + 1;
  document.getElementById("quizScore").textContent = quizScore;
  document.getElementById("quizUrlDomain").textContent = c.domain;
  document.getElementById("quizUrlPath").textContent = c.path;
  document.getElementById("quizCaseCategory").textContent = c.category;
  document.getElementById("quizCaseTitle").textContent = c.title;
  document.getElementById("quizCaseDesc").textContent = c.desc;
  document.getElementById("quizVisualBox").textContent = c.preview;

  document.getElementById("quizVoteButtons").classList.remove("hidden");
  document.getElementById("quizExplanationBox").classList.add("hidden");
}

function submitQuizAnswer(votedSafe) {
  const c = QUIZ_CASES[currentQuizIdx];
  const isCorrect = votedSafe === c.isSafe;
  if (isCorrect) quizScore++;

  document.getElementById("quizScore").textContent = quizScore;
  document.getElementById("quizVoteButtons").classList.add("hidden");

  const expBox = document.getElementById("quizExplanationBox");
  expBox.classList.remove("hidden");
  document.getElementById("quizExpTitle").textContent =
    (isCorrect ? "🎯 Точно в ціль! " : "💥 Зал попався! ") + c.expTitle;
  document.getElementById("quizExpText").textContent = c.expText;

  const nextBtn = document.getElementById("quizNextBtn");
  if (currentQuizIdx < QUIZ_CASES.length - 1) {
    nextBtn.textContent = "Наступний кейс →";
  } else {
    nextBtn.textContent = "Почати квіз спочатку ↻";
  }
}

function nextQuizCase() {
  if (currentQuizIdx < QUIZ_CASES.length - 1) {
    currentQuizIdx++;
  } else {
    currentQuizIdx = 0;
    quizScore = 0;
  }
  renderQuizCase();
}

/* ============================================================================
   СЛАЙД 10: Чек-лист
   ============================================================================ */
function updateShieldScore() {
  const checks = document.querySelectorAll(".checklist-interactive input[type='checkbox']");
  let checked = 0;
  checks.forEach((c) => {
    if (c.checked) checked++;
  });
  const status = document.getElementById("shieldStatusText");
  status.textContent = `🛡️ Рівень захисту аудиторії: ${checked} / 5 виконано (${checked * 20}%)`;
}

// Ініціалізація при завантаженні
window.addEventListener("DOMContentLoaded", () => {
  initTopProgressStrip();
  buildSlideSplitSwitchers();
  initLinuxVM();
  goToSlide(0);
  updateCaesar();
  runAESDemo();
  updateDHColors();
  simulateSendMessage();
  compareHashes();
  evaluatePassword();
  signDocumentNow();
  inspectHttpsCert("bank");
  renderQuizCase();
});

function buildSlideSplitSwitchers() {
  document.querySelectorAll(".slide-inner").forEach((slideInner) => {
    const layout = document.createElement("div");
    layout.className = "slide-pane-layout";

    const sideBtns = document.createElement("div");
    sideBtns.className = "slide-pane-btns";

    const btnSlide = document.createElement("button");
    btnSlide.type = "button";
    btnSlide.className = "pane-switch-btn btn-mode-diagram active";
    btnSlide.title = "Показати слайд та інтерактивне демо";
    btnSlide.innerHTML = `<span class="pane-switch-icon">🖼️</span><span>Слайд</span>`;
    btnSlide.addEventListener("click", () => syncActiveSlideBoxMode("diagram"));

    const btnTerm = document.createElement("button");
    btnTerm.type = "button";
    btnTerm.className = "pane-switch-btn btn-mode-terminal";
    btnTerm.title = "Перемкнути все вікно на Linux Термінал";
    btnTerm.innerHTML = `<span class="pane-switch-icon">🐧</span><span>Термінал</span>`;
    btnTerm.addEventListener("click", () => syncActiveSlideBoxMode("terminal"));

    const btnSections = document.createElement("button");
    btnSections.type = "button";
    btnSections.className = "pane-switch-btn btn-mode-sections";
    btnSections.title = "Відкрити список розділів та підвкладок (M)";
    btnSections.innerHTML = `<span class="pane-switch-icon">☰</span><span>Розділи</span>`;
    btnSections.addEventListener("click", () => openNavToast());

    sideBtns.appendChild(btnSlide);
    sideBtns.appendChild(btnTerm);
    sideBtns.appendChild(btnSections);

    const viewport = document.createElement("div");
    viewport.className = "slide-pane-viewport";

    slideInner.parentNode.insertBefore(layout, slideInner);
    viewport.appendChild(slideInner);
    layout.appendChild(sideBtns);
    layout.appendChild(viewport);
  });
}

function syncActiveSlideBoxMode(mode) {
  const activeSlide = slides[currentSlide];
  if (!activeSlide) return;

  const layout = activeSlide.querySelector(".slide-pane-layout");
  if (!layout) return;

  const viewport = layout.querySelector(".slide-pane-viewport");
  const slideInner = viewport ? viewport.querySelector(".slide-inner") : null;
  const dock = document.getElementById("linuxVmDock");
  const btnDiagram = layout.querySelector(".btn-mode-diagram");
  const btnTerminal = layout.querySelector(".btn-mode-terminal");

  const isTerm = mode === "terminal";
  if (btnDiagram) btnDiagram.classList.toggle("active", !isTerm);
  if (btnTerminal) btnTerminal.classList.toggle("active", isTerm);

  if (isTerm && viewport && dock) {
    if (slideInner) slideInner.classList.add("hidden");
    viewport.appendChild(dock);
    dock.classList.remove("hidden");
    focusVmInput();
  } else {
    if (slideInner) slideInner.classList.remove("hidden");
    if (dock) dock.classList.add("hidden");
  }
}

/* ============================================================================
   ВБУДОВАНА LINUX CRYPTO VM + КОНТЕКСТНІ CLI-ПРИКЛАДИ ДО КОЖНОЇ ТЕМИ
   ============================================================================ */
const SLIDE_CLI_EXAMPLES = [
  {
    topic: "Перевірка криптографічного ядра OpenSSL у Linux:",
    cmd: "openssl version -a && ls -la ~/lab"
  },
  {
    topic: "Перехоплення відкритого пакета HTTP vs зашифрованого потоку:",
    cmd: "cat packet_http.txt && openssl rand -hex 24"
  },
  {
    topic: "Демонстрація слабкості класичних підстановок і кодувань у CLI:",
    cmd: "echo \"Зустріч о 15:00\" | base64 && echo \"0JfRg9GB0YLRgNGW0Ycg0L4gMTU6MDAK\" | base64 -d"
  },
  {
    topic: "Шифрування тексту сучасним алгоритмом AES-256-CBC через OpenSSL:",
    cmd: 'echo "Зустріч о 15:00" | openssl enc -aes-256-cbc -a -pbkdf2 -pass pass:SecretKey2026'
  },
  {
    topic: "Генерація власної пари асиметричних ключів (Ed25519):",
    cmd: "ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N '' && cat ~/.ssh/id_ed25519.pub"
  },
  {
    topic: "Генерація параметрів обміну ключами Діффі-Геллмана (ECDH):",
    cmd: "openssl ecparam -name prime256v1 -genkey -noout | openssl ec -text -noout"
  },
  {
    topic: "Перевірка зашифрованого пакета месенджера (E2EE payload):",
    cmd: "cat secret.enc && openssl rand -hex 32"
  },
  {
    topic: "Обчислення криптографічного хешу SHA-256 у терміналі:",
    cmd: 'echo -n "MySecret2026" | sha256sum'
  },
  {
    topic: "Лавинний ефект у CLI (порівняння двох SHA-256 при зміні 1 знака):",
    cmd: 'echo -n "Переказ: 100 грн" | sha256sum && echo -n "Переказ: 100 грн." | sha256sum'
  },
  {
    topic: "Підпис документа особистим сертифікатом (КЕП) та перевірка через OpenSSL:",
    cmd: "openssl dgst -sha256 -sign personal_key.pem -out contract.sig contract.txt && openssl dgst -sha256 -verify personal_cert.pub -signature contract.sig contract.txt"
  },
  {
    topic: "Перевірка TLS/HTTPS-сертифіката домену та центру сертифікації CA:",
    cmd: "openssl s_client -connect monobank.ua:443 -brief"
  },
  {
    topic: "Перевірка IP-адреси підозрілого фішингового хостингу:",
    cmd: "dig +short instagrarn.com"
  },
  {
    topic: "Виявлення фішингового Punycode-домену (омографів) через Python IDNA:",
    cmd: "python3 -c \"print('stеampowered.com'.encode('idna').decode())\""
  },
  {
    topic: "Генерація одноразового 6-значного 2FA-токена (TOTP):",
    cmd: "oathtool --totp -b JBSWY3DPEHPK3PXP"
  },
  {
    topic: "Генерація надійної криптостійкої парольної фрази (256 біт ентропії):",
    cmd: "openssl rand -base64 24"
  }
];

// Віртуальна файлова система Linux VM
const VM_FS = {
  "readme.txt": "Ласкаво просимо до навчальної Linux Crypto VM!\nДоступні утиліти: openssl, sha256sum, md5sum, base64, ssh-keygen, dig, oathtool, python3, cat, ls, echo.",
  "packet_http.txt": "[Wireshark Capture] POST /login HTTP/1.1 | Host: cafe-wifi.local | user=student&pass=qwerty12345 (ВІДКРИТИЙ ТЕКСТ!)",
  "passwords_leaked.txt": "123456\n12345678\nqwerty12345\nP@ssw0rd!\nolesia2008\nivan2007",
  "secret.enc": "U2FsdGVkX19k8f3a10c9b7e21d44a009c81f2a=="
};

let vmHistory = [];
let vmHistoryIdx = -1;

function updateCliSuggestionForSlide(slideIdx) {
  const item = SLIDE_CLI_EXAMPLES[slideIdx] || SLIDE_CLI_EXAMPLES[0];
  const labelEl = document.getElementById("cliTopicLabel");
  const cmdEl = document.getElementById("cliSuggestedCmd");
  if (labelEl && cmdEl) {
    labelEl.textContent = item.topic;
    cmdEl.textContent = item.cmd;
  }
}

function focusVmInput() {
  const inp = document.getElementById("vmCommandInput");
  if (inp) inp.focus();
}

function appendVmLine(text, cls = "vm-line-out") {
  const out = document.getElementById("vmOutput");
  if (!out) return;
  const div = document.createElement("div");
  div.className = `vm-line ${cls}`;
  div.textContent = text;
  out.appendChild(div);
  const body = document.getElementById("vmTerminalBody");
  if (body) body.scrollTop = body.scrollHeight;
}

function clearTerminal() {
  const out = document.getElementById("vmOutput");
  if (out) out.innerHTML = "";
}

function copySuggestedCli() {
  const cmd = document.getElementById("cliSuggestedCmd").textContent;
  const inp = document.getElementById("vmCommandInput");
  inp.value = cmd;
  inp.focus();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(cmd).catch(() => {});
  }
}

async function runSuggestedCli() {
  const cmd = document.getElementById("cliSuggestedCmd").textContent;
  const inp = document.getElementById("vmCommandInput");
  inp.value = cmd;
  await executeVmCommand(cmd);
  inp.value = "";
}

function initLinuxVM() {
  appendVmLine(
    "Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-crypto-generic x86_64) — Web Crypto Shell готова до роботи.",
    "vm-line-ok"
  );
  appendVmLine(
    "Підказка: Натисніть «▶ Вставити та виконати» у верхній панелі термінала або введіть власну команду (наприклад: help, ls, sha256sum, openssl).",
    "vm-line-out"
  );

  const inp = document.getElementById("vmCommandInput");
  if (!inp) return;

  inp.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const cmd = inp.value.trim();
      inp.value = "";
      if (cmd) {
        vmHistory.push(cmd);
        vmHistoryIdx = vmHistory.length;
      }
      await executeVmCommand(cmd);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (vmHistoryIdx > 0) {
        vmHistoryIdx--;
        inp.value = vmHistory[vmHistoryIdx];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (vmHistoryIdx < vmHistory.length - 1) {
        vmHistoryIdx++;
        inp.value = vmHistory[vmHistoryIdx];
      } else {
        vmHistoryIdx = vmHistory.length;
        inp.value = "";
      }
    }
  });
}

async function executeVmCommand(rawCmd) {
  appendVmLine(`student@crypto-vm:~/lab$ ${rawCmd}`, "vm-line-cmd");
  if (!rawCmd) return;

  // Підтримка ланцюжків команд через &&
  if (rawCmd.includes("&&")) {
    const parts = rawCmd.split("&&").map((s) => s.trim());
    for (const part of parts) {
      await runSingleCommand(part);
    }
    return;
  }
  await runSingleCommand(rawCmd);
}

function extractEchoText(cmdSegment) {
  const m = cmdSegment.match(/echo\s+(?:-n\s+)?(?:"([^"]*)"|'([^']*)'|(.+))/);
  if (!m) return "";
  return (m[1] ?? m[2] ?? m[3] ?? "").trim();
}

async function runSingleCommand(cmd) {
  // Обробка конвеєрів (pipe |)
  if (cmd.includes("|")) {
    const stages = cmd.split("|").map((s) => s.trim());
    const left = stages[0];
    const right = stages.slice(1).join(" | ");
    const inputText = left.startsWith("echo") ? extractEchoText(left) : left;

    if (right.startsWith("sha256sum")) {
      const h = await sha256Hex(inputText);
      appendVmLine(`${h}  -`, "vm-line-ok");
      return;
    }
    if (right.startsWith("md5sum")) {
      const h = (await sha256Hex("md5:" + inputText)).slice(0, 32);
      appendVmLine(`${h}  -`, "vm-line-ok");
      return;
    }
    if (right.startsWith("base64 -d")) {
      try {
        const dec = decodeURIComponent(escape(atob(inputText.trim())));
        appendVmLine(dec, "vm-line-ok");
      } catch {
        appendVmLine("base64: некоректні вхідні дані", "vm-line-err");
      }
      return;
    }
    if (right.startsWith("base64")) {
      const b64 = btoa(unescape(encodeURIComponent(inputText)));
      appendVmLine(b64, "vm-line-ok");
      return;
    }
    if (right.includes("openssl enc") && right.includes("-aes-256")) {
      const passMatch = right.match(/pass:([^\s]+)/);
      const pwd = passMatch ? passMatch[1] : "default";
      const enc = new TextEncoder();
      const digest = await crypto.subtle.digest("SHA-256", enc.encode(pwd + "::vm-iv"));
      const iv = new Uint8Array(digest).slice(0, 12);
      const key = await deriveAESKey(pwd);
      const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(inputText));
      const b64 = btoa(String.fromCharCode(...new Uint8Array(cipherBuf)));
      appendVmLine(`U2FsdGVkX1+${b64}`, "vm-line-ok");
      return;
    }
    if (right.includes("openssl ec -text")) {
      const privHex = (await sha256Hex(String(Date.now()))).match(/.{1,2}/g).slice(0, 32).join(":");
      const pubHex = (await sha256Hex("pub:" + Date.now())).match(/.{1,2}/g).slice(0, 32).join(":");
      appendVmLine("Private-Key: (256 bit)", "vm-line-out");
      appendVmLine(`priv:   ${privHex}`, "vm-line-out");
      appendVmLine(`pub:    04:${pubHex}`, "vm-line-ok");
      appendVmLine("ASN1 OID: prime256v1 (NIST P-256 ECDH)", "vm-line-ok");
      return;
    }
  }

  const tokens = cmd.split(/\s+/);
  const bin = tokens[0];

  switch (bin) {
    case "help":
      appendVmLine(
        "Доступні команди Linux Crypto VM:\n" +
          "  openssl version -a                  — версія криптографічної бібліотеки\n" +
          "  openssl rand -hex 24 / -base64 24   — генератор криптостійких випадкових ключів\n" +
          '  echo -n "текст" | sha256sum         — обчислення реального SHA-256 хешу\n' +
          '  echo "текст" | openssl enc -aes-256-cbc -a -pbkdf2 -pass pass:КЛЮЧ\n' +
          "  ssh-keygen -t ed25519               — генерація пари публічного та приватного ключів\n" +
          "  openssl s_client -connect monobank.ua:443 -brief — перевірка TLS/HTTPS сертифіката\n" +
          "  dig +short <домен>                  — перевірка IP домену\n" +
          "  oathtool --totp -b <SECRET>         — генерація 6-значного 2FA TOTP коду\n" +
          "  ls, cat <файл>, whoami, uname -a, clear",
        "vm-line-out"
      );
      break;

    case "clear":
      clearTerminal();
      break;

    case "ls":
      appendVmLine(
        "drwxr-xr-x 2 student student 4096 Жов 21 18:00 .\n" +
          "-rw-r--r-- 1 student student  192 Жов 21 18:00 readme.txt\n" +
          "-rw-r--r-- 1 student student  128 Жов 21 18:00 packet_http.txt\n" +
          "-rw-r--r-- 1 student student   84 Жов 21 18:00 passwords_leaked.txt\n" +
          "-rw-r--r-- 1 student student   44 Жов 21 18:00 secret.enc",
        "vm-line-out"
      );
      break;

    case "cat": {
      const target = tokens[1] || "";
      if (target.includes("id_ed25519.pub")) {
        const pubHash = (await sha256Hex("ed25519-student")).slice(0, 43);
        appendVmLine(
          `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI${pubHash} student@crypto-vm`,
          "vm-line-ok"
        );
      } else if (VM_FS[target]) {
        appendVmLine(VM_FS[target], "vm-line-out");
      } else {
        appendVmLine(`cat: ${target || "(не вказано файл)"}: Такого файлу немає (спробуйте: ls)`, "vm-line-err");
      }
      break;
    }

    case "whoami":
      appendVmLine("student", "vm-line-out");
      break;

    case "pwd":
      appendVmLine("/home/student/lab", "vm-line-out");
      break;

    case "uname":
      appendVmLine("Linux crypto-vm 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux", "vm-line-out");
      break;

    case "echo":
      appendVmLine(extractEchoText(cmd), "vm-line-out");
      break;

    case "openssl": {
      const sub = tokens[1] || "";
      if (sub === "version") {
        appendVmLine("OpenSSL 3.2.1 30 Jan 2024 (Library: OpenSSL 3.2.1)", "vm-line-ok");
        appendVmLine("built on: Ubuntu 24.04 LTS | platform: linux-x86_64 | AES-NI hardware acceleration: enabled", "vm-line-out");
      } else if (sub === "rand") {
        const isBase64 = tokens.includes("-base64");
        const count = parseInt(tokens[tokens.length - 1], 10) || 24;
        const arr = new Uint8Array(Math.min(count, 64));
        crypto.getRandomValues(arr);
        if (isBase64) {
          appendVmLine(btoa(String.fromCharCode(...arr)), "vm-line-ok");
        } else {
          appendVmLine(bufToHex(arr), "vm-line-ok");
        }
      } else if (sub === "s_client") {
        const hostArg = tokens[tokens.indexOf("-connect") + 1] || "monobank.ua:443";
        appendVmLine(`CONNECTED(00000003) -> ${hostArg}`, "vm-line-ok");
        appendVmLine("Protocol version: TLSv1.3 | CipherSuite: TLS_AES_256_GCM_SHA384", "vm-line-ok");
        appendVmLine(`Peer certificate: CN = ${hostArg.split(":")[0]}, O = Let's Encrypt / DigiCert`, "vm-line-out");
        appendVmLine("Verification: OK (Зашифровано, але завжди перевіряйте точну назву домену!)", "vm-line-out");
      } else if (sub === "dgst") {
        if (tokens.includes("-sign")) {
          const sigPreview = (await sha256Hex("ecdsa-sig-" + Date.now())).slice(0, 48);
          appendVmLine("Підписання файлу contract.txt особистим приватним ключем (personal_key.pem)...", "vm-line-out");
          appendVmLine(`Створено файл електронного підпису contract.sig (ECDSA-SHA256: ${sigPreview}...)`, "vm-line-ok");
        } else if (tokens.includes("-verify")) {
          appendVmLine("Перевірка підпису contract.sig за допомогою сертифіката personal_cert.pub...", "vm-line-out");
          appendVmLine("Verified OK (Підпис КЕП дійсний, цілісність документа contract.txt підтверджено!)", "vm-line-ok");
        }
      } else {
        appendVmLine("Використання openssl: openssl version -a | openssl rand -hex 24 | openssl dgst -sha256 -sign ... | openssl s_client -connect host:443", "vm-line-out");
      }
      break;
    }

    case "ssh-keygen": {
      const fp = (await sha256Hex("ssh-key-" + Date.now())).slice(0, 32);
      appendVmLine("Generating public/private ed25519 key pair.", "vm-line-out");
      appendVmLine("Your identification has been saved in /home/student/.ssh/id_ed25519 (ПРИВАТНИЙ КЛЮЧ — нікому не передавати!)", "vm-line-out");
      appendVmLine("Your public key has been saved in /home/student/.ssh/id_ed25519.pub (ПУБЛІЧНИЙ ЗАМОК — можна роздавати)", "vm-line-ok");
      appendVmLine(`Key fingerprint: SHA256:${btoa(fp).slice(0, 43)} student@crypto-vm`, "vm-line-ok");
      break;
    }

    case "dig": {
      const domain = tokens[tokens.length - 1];
      if (domain.includes("instagrarn")) {
        appendVmLine("185.199.108.153  [⚠️ ПІДОЗРІЛИЙ ХОСТИНГ: домен instagrarn.com зареєстровано 2 дні тому!]", "vm-line-err");
      } else {
        appendVmLine(`142.250.186.110  [Офіційний IP вузла ${domain}]`, "vm-line-ok");
      }
      break;
    }

    case "python3": {
      if (cmd.includes("idna")) {
        appendVmLine("xn--stampowered-tbb.com  <-- УВАГА! Виявлено кириличну літеру «е» (Punycode омограф)!", "vm-line-err");
      } else {
        appendVmLine("Python 3.12.3 (Ubuntu 24.04) — виконано.", "vm-line-ok");
      }
      break;
    }

    case "oathtool": {
      const sec = Math.floor(Date.now() / 30000);
      const hash = await sha256Hex("totp-" + sec);
      const code = String(parseInt(hash.slice(0, 6), 16) % 1000000).padStart(6, "0");
      const leftSec = 30 - (Math.floor(Date.now() / 1000) % 30);
      appendVmLine(`🔑 Поточний 6-значний 2FA TOTP код: ${code} (дійсний ще ${leftSec} сек)`, "vm-line-ok");
      break;
    }

    default:
      appendVmLine(
        `bash: ${bin}: команда не знайдена. Введіть 'help', щоб побачити доступні крипто-інструменти.`,
        "vm-line-err"
      );
  }
}

