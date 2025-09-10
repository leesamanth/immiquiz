/* angular.module("quizApp", []).controller("QuizController", function ($http) {
  var vm = this;
  vm.started = false;
  vm.finished = false;
  vm.currentIndex = 0;
  vm.score = 0;
  vm.result = null;
  vm.userAnswer = "";
  vm.questions = [];

  // Load all questions from questions.json
  vm.allQuestions = [];
  $http.get("../data/questions.json").then(function (response) {
    var data = response.data;
    // Flatten all questions from all sections
    var flatQuestions = [];
    data.forEach(function (section) {
      section.questions.forEach(function (q) {
        flatQuestions.push(q);
      });
    });
    vm.allQuestions = flatQuestions;
  });

  // Quiz all questions
  vm.startQuizAll = function () {
    if (!vm.allQuestions || vm.allQuestions.length < 1) {
      alert("Questions not loaded yet. Please wait and try again.");
      return;
    }
    vm.started = true;
    vm.finished = false;
    vm.score = 0;
    vm.currentIndex = 0;
    vm.result = null;
    vm.userAnswer = "";
    // Shuffle all questions
    vm.questions = vm.allQuestions.slice();
    for (var i = vm.questions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = vm.questions[i];
      vm.questions[i] = vm.questions[j];
      vm.questions[j] = temp;
    }
    vm.currentQuestion = vm.questions[vm.currentIndex];
  }; */
angular.module("quizApp", []).controller("QuizController", function ($http) {
  var vm = this;
  vm.flashFlipping = false;
  // Flash cards feature
  vm.flashMode = false;
  vm.flashCards = [];
  vm.flashIndex = 0;
  vm.flashAnswerRevealed = false;

  vm.startFlashCards = function () {
    if (!vm.allQuestions || vm.allQuestions.length < 1) {
      alert("Questions not loaded yet. Please wait and try again.");
      return;
    }
    vm.flashMode = true;
    vm.flashAnswerRevealed = false;
    // Shuffle and pick 100 questions
    var shuffled = vm.allQuestions.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    vm.flashCards = shuffled.slice(0, 100);
    vm.flashIndex = 0;
  };

  vm.revealFlashAnswer = function () {
    vm.flashAnswerRevealed = true;
  };

  vm.nextFlashCard = function () {
    vm.flashFlipping = true;
    setTimeout(function () {
      vm.flashAnswerRevealed = false;
      vm.flashIndex++;
      if (vm.flashIndex >= vm.flashCards.length) {
        vm.flashIndex = 0;
      }
      vm.flashFlipping = false;
      if (!vm.$$phase && !$http.$$phase) {
        var el = document.querySelector("[ng-controller]");
        if (el && window.angular) {
          window.angular.element(el).scope().$apply();
        }
      }
    }, 400); // 400ms shuffle animation duration
  };

  // On card click: reveal answer if not revealed, else go to next card
  vm.flashCardClick = function () {
    if (!vm.flashAnswerRevealed) {
      vm.revealFlashAnswer();
    } else {
      vm.nextFlashCard();
    }
  };

  vm.exitFlashCards = function () {
    vm.flashMode = false;
    vm.flashCards = [];
    vm.flashIndex = 0;
    vm.flashAnswerRevealed = false;
  };
  var vm = this;
  vm.started = false;
  vm.finished = false;
  vm.currentIndex = 0;
  vm.score = 0;
  vm.result = null;
  vm.userAnswer = "";
  vm.questions = [];
  vm.exclude = [
    "a",
    "an",
    "the",
    "this",
    "and",
    "was",
    "is",
    "of",
    "by",
    "for",
    "your",
    "if",
  ];

  // Load all questions from questions.json
  vm.allQuestions = [];
  $http.get("questions.json").then(function (response) {
    var data = response.data;
    // Flatten all questions from all sections
    var flatQuestions = [];
    data.forEach(function (section) {
      section.questions.forEach(function (q) {
        flatQuestions.push(q);
      });
    });
    vm.allQuestions = flatQuestions;
  });

  vm.startQuiz = function () {
    if (!vm.allQuestions || vm.allQuestions.length < 10) {
      alert("Questions not loaded yet. Please wait and try again.");
      return;
    }
    vm.started = true;
    vm.finished = false;
    vm.score = 0;
    vm.currentIndex = 0;
    vm.result = null;
    vm.userAnswer = "";
    // Randomly select 10 questions from all loaded
    vm.questions = [];
    var used = {};
    while (vm.questions.length < 10) {
      var idx = Math.floor(Math.random() * vm.allQuestions.length);
      if (!used[idx]) {
        vm.questions.push(vm.allQuestions[idx]);
        used[idx] = true;
      }
    }
    vm.currentQuestion = vm.questions[vm.currentIndex];
  };

  // Quiz all questions
  vm.startQuizAll = function () {
    if (!vm.allQuestions || vm.allQuestions.length < 1) {
      alert("Questions not loaded yet. Please wait and try again.");
      return;
    }
    vm.started = true;
    vm.finished = false;
    vm.score = 0;
    vm.currentIndex = 0;
    vm.result = null;
    vm.userAnswer = "";
    // Shuffle all questions
    vm.questions = vm.allQuestions.slice();
    for (var i = vm.questions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = vm.questions[i];
      vm.questions[i] = vm.questions[j];
      vm.questions[j] = temp;
    }
    vm.currentQuestion = vm.questions[vm.currentIndex];
  };

  // Helper: Levenshtein distance
  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var matrix = [];
    for (var i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (var j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (var i = 1; i <= b.length; i++) {
      for (var j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function extractKeywords(sentence) {
    return sentence
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word && !exclude.includes(word));
  }

  // Consider a match if Levenshtein distance is <= 2 or answer is contained in correct answer

  vm.submitAnswer = function () {
    if (!vm.userAnswer) return;
    var answer = vm.userAnswer.trim().toLowerCase();
    //var ansKeywords = extractKeywords(answer);
    /* var answerAcceptable = true;
    vm.currentQuestion.answers.forEach((anAns) => {
      var elementKeywords = extractKeywords(anAns);
      // check if the length of the answer is equal to the smallest keyword length
      var minLength = Math.min(...elementKeywords.map((kw) => kw.length));
      if (answer.length === minLength) {
        answerAcceptable = false;
        return false;
      }
    }); */
    var correct = vm.currentQuestion.answers.some(function (ans) {
      var ansNorm = ans.trim().toLowerCase();
      // remove words enclosed in () from ansNorm if the word is not a number
      ansNorm = ansNorm.replace(/\((?!\d+\))[^)]+\)/g, "").trim();

      var dist = levenshtein(answer, ansNorm);
      console.log("Comparing:", answer, "with:", ansNorm, "Distance:", dist);
      return dist <= 2;
    });
    // if atleast 2 words from the answer matches with any 2 words in the listed answers after removing function words consider the response correct
    if (!correct) {
      console.log("Checking for partial matches...");
      vm.currentQuestion.answers.some(function (ans) {
        var ansNorm = ans.trim().toLowerCase();
        console.log("Partial match check with:", ansNorm);
        var answerWords = answer.split(/\W+/).filter(Boolean);
        //remove function words from answerWords
        answerWords = answerWords.filter(function (word) {
          return !vm.exclude.includes(word);
        });
        var matchingWords = 0;
        answerWords.forEach(function (word) {
          if (ansNorm.includes(word)) {
            matchingWords++;
            console.log("Found matching word:", word);
          }
        });
        if (matchingWords >= 2) {
          correct = true;
        }
      });
    }

    vm.result = correct;
    // Only score if correct and not already scored for this question
    if (correct && typeof vm.answeredCorrectly === "undefined") {
      vm.score++;
      vm.answeredCorrectly = true;
    }
  };

  // Skip question: counts as failed (does not increment score)
  vm.skipQuestion = function () {
    vm.result = false;
    vm.answeredCorrectly = false;
  };

  vm.nextQuestion = function () {
    vm.result = null;
    vm.userAnswer = "";
    vm.currentIndex++;
    vm.answeredCorrectly = undefined;
    if (vm.currentIndex < vm.questions.length) {
      vm.currentQuestion = vm.questions[vm.currentIndex];
    } else {
      vm.finished = true;
      vm.started = false;
    }
  };

  vm.restartQuiz = function () {
    vm.started = false;
    vm.finished = false;
    vm.score = 0;
    vm.currentIndex = 0;
    vm.result = null;
    vm.userAnswer = "";
    vm.questions = [];
    vm.answeredCorrectly = undefined;
  };
});
