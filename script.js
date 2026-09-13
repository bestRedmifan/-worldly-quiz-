// WORLDY QUIZ
// No internet connection detection.

let language = "en";
let coins = 0;
let level = 1;
let questionNumber = 1;
let gameMode = "beginner";

const words = {
    en: [
        ["apple", "a fruit"],
        ["house", "a building where people live"],
        ["book", "something you read"],
        ["water", "a drink"],
        ["school", "a place for learning"],
        ["computer", "an electronic device"],
        ["car", "a vehicle"],
        ["sun", "the star in our sky"]
    ],

    fa: [
        ["سیب", "یک میوه"],
        ["خانه", "جایی برای زندگی"],
        ["کتاب", "چیزی برای خواندن"],
        ["آب", "یک نوشیدنی"],
        ["مدرسه", "جای یادگیری"],
        ["کامپیوتر", "یک وسیله الکترونیکی"],
        ["ماشین", "یک وسیله نقلیه"],
        ["خورشید", "ستاره آسمان ما"]
    ],

    ar: [
        ["تفاحة", "فاكهة"],
        ["بيت", "مكان للعيش"],
        ["كتاب", "شيء للقراءة"],
        ["ماء", "مشروب"],
        ["مدرسة", "مكان للتعلم"],
        ["حاسوب", "جهاز إلكتروني"],
        ["سيارة", "وسيلة نقل"],
        ["شمس", "النجم في سمائنا"]
    ]
};

function show(id) {
    document.querySelectorAll("section").forEach(function(section) {
        section.style.display = "none";
    });

    const page = document.getElementById(id);

    if (page) {
        page.style.display = "block";
    }
}

function button(id, action) {
    const element = document.getElementById(id);

    if (element) {
        element.onclick = action;
    }
}

/* LANGUAGE */

button("persianButton", function() {
    setLanguage("fa");
});

button("arabicButton", function() {
    setLanguage("ar");
});

button("englishButton", function() {
    setLanguage("en");
});

function setLanguage(lang) {
    language = lang;

    document.documentElement.lang = lang;

    if (lang === "ar" || lang === "fa") {
        document.documentElement.dir = "rtl";
    } else {
        document.documentElement.dir = "ltr";
    }

    show("mainMenu");
}

/* MENU */

button("beginnerButton", function() {
    gameMode = "beginner";
    startBeginner();
});

button("vipButton", function() {
    show("vipScreen");
});

button("inviteButton", function() {
    show("inviteScreen");
});

button("loginButton", function() {
    show("idScreen");
});

button("createIdButton", function() {
    show("idScreen");
});

/* ID */

button("generateIdButton", function() {
    let id = "";

    for (let i = 0; i < 10; i++) {
        id += Math.floor(Math.random() * 10);
    }

    document.getElementById("playerID").value = id;
});

button("enterIdButton", function() {
    const input = document.getElementById("playerID");
    const message = document.getElementById("idMessage");

    if (!input) return;

    const id = input.value.trim();

    if (!/^\d{9,12}$/.test(id)) {
        message.textContent = "ID must contain 9-12 digits.";
        return;
    }

    localStorage.setItem("worldyQuizID", id);

    message.textContent = "ID saved!";
});

button("helpIdButton", function() {
    alert("Your ID must contain 9 to 12 digits.");
});

button("backFromIdButton", function() {
    show("mainMenu");
});

/* VIP */

button("vipConfirmButton", function() {
    const code = document.getElementById("vipCode").value;
    const message = document.getElementById("vipMessage");

    if (language === "ar") {
        message.textContent = "منطقه و زبان شما پشتیبانی نمیشود";
        return;
    }

    if (code === "3690") {
        message.textContent = "VIP activated!";
        gameMode = "vip";
        startVIP();
    } else {
        message.textContent = "Wrong VIP code.";
    }
});

button("backFromVipButton", function() {
    show("mainMenu");
});

/* INVITE */

button("inviteButtonConfirm", function() {
    const code = document.getElementById("inviteCode").value;
    const message = document.getElementById("inviteMessage");

    if (language === "ar") {
        message.textContent = "منطقه و زبان شما پشتیبانی نمیشود";
        return;
    }

    if (code === "369012") {
        coins += 1000000;
        updateCoins();
        message.textContent = "1,000,000 coins added!";
    } else {
        message.textContent = "Wrong invite code.";
    }
});

button("backFromInviteButton", function() {
    show("mainMenu");
});

/* BEGINNER GAME */

function startBeginner() {
    questionNumber = 1;
    level = 1;

    updateCoins();
    show("gameScreen");

    newWordQuestion();
}

function newWordQuestion() {
    const list = words[language] || words.en;
    const item = list[Math.floor(Math.random() * list.length)];

    window.currentQuestion = item;

    document.getElementById("level").textContent = level;
    document.getElementById("questionNumber").textContent = questionNumber;
    document.getElementById("questionText").textContent =
        "What does: " + item[0] + " mean?";

    document.getElementById("answerInput").value = "";
    document.getElementById("gameMessage").textContent = "";
}

button("submitButton", function() {
    if (gameMode === "vip") {
        checkMathAnswer();
        return;
    }

    const answer =
        document.getElementById("answerInput").value
        .trim()
        .toLowerCase();

    const correct =
        window.currentQuestion[1].toLowerCase();

    if (answer === correct) {
        coins += 25;
        document.getElementById("gameMessage").textContent =
            "Correct! +25 coins 🎉";

        level++;
    } else {
        coins -= 10;

        if (coins < 0) coins = 0;

        document.getElementById("gameMessage").textContent =
            "Wrong! -10 coins 😐";
    }

    updateCoins();

    questionNumber++;

    setTimeout(newWordQuestion, 700);
});

button("skipButton", function() {
    questionNumber++;
    newWordQuestion();
});

button("hintButton", function() {
    if (!window.currentQuestion) return;

    document.getElementById("gameMessage").textContent =
        "Hint: " + window.currentQuestion[1];
});

function updateCoins() {
    const element = document.getElementById("coins");

    if (element) {
        element.textContent = coins;
    }
}

/* VIP MATH */

let mathAnswer = 0;

function startVIP() {
    questionNumber = 1;
    show("gameScreen");
    newMathQuestion();
}

function newMathQuestion() {
    const a = Math.floor(Math.random() * 100) + 1;
    const b = Math.floor(Math.random() * 100) + 1;

    const operations = ["+", "-", "*", "/"];
    const operation =
        operations[Math.floor(Math.random() * operations.length)];

    if (operation === "+") {
        mathAnswer = a + b;
    }

    if (operation === "-") {
        mathAnswer = a - b;
    }

    if (operation === "*") {
        mathAnswer = a * b;
    }

    if (operation === "/") {
        mathAnswer = Math.round((a / b) * 100) / 100;
    }

    document.getElementById("questionNumber").textContent =
        questionNumber;

    document.getElementById("questionText").textContent =
        a + " " + operation + " " + b + " = ?";

    document.getElementById("answerInput").value = "";
    document.getElementById("gameMessage").textContent = "";
}

function checkMathAnswer() {
    const answer = Number(
        document.getElementById("answerInput").value
    );

    if (answer === mathAnswer) {
        document.getElementById("gameMessage").textContent =
            "Correct! 🎉";

        questionNumber++;

        if (questionNumber <= 10) {
            setTimeout(newMathQuestion, 500);
        } else {
            document.getElementById("gameMessage").textContent =
                "You completed the 10 VIP questions! 🏆";
        }

    } else {
        document.getElementById("gameMessage").textContent =
            "Wrong answer 😐";
    }
}

/* CHEAT */

button("cheatButton", function() {
    const code = document.getElementById("cheatCode").value;

    if (code === "1590") {
        document.getElementById("lockTimer").textContent = "00:00";
        show("mainMenu");
    } else {
        alert("Wrong cheat code.");
    }
});

/* START
   IMPORTANT: NO INTERNET CHECK HERE.
*/

show("languageScreen");
