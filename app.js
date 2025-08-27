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
  vm.started = false;
  vm.finished = false;
  vm.currentIndex = 0;
  vm.score = 0;
  vm.result = null;
  vm.userAnswer = "";
  vm.questions = [];

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
    if (!vm.allQuestions || vm.allQuestions.length < 6) {
      alert("Questions not loaded yet. Please wait and try again.");
      return;
    }
    vm.started = true;
    vm.finished = false;
    vm.score = 0;
    vm.currentIndex = 0;
    vm.result = null;
    vm.userAnswer = "";
    // Randomly select 6 questions from all loaded
    vm.questions = [];
    var used = {};
    while (vm.questions.length < 6) {
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

  // Consider a match if Levenshtein distance is <= 2 or answer is contained in correct answer
  vm.submitAnswer = function () {
    if (!vm.userAnswer) return;
    var answer = vm.userAnswer.trim().toLowerCase();
    var correct = vm.currentQuestion.answers.some(function (ans) {
      var ansNorm = ans.trim().toLowerCase();
      var dist = levenshtein(answer, ansNorm);
      return (
        dist <= 2 ||
        ansNorm.indexOf(answer) !== -1 ||
        answer.indexOf(ansNorm) !== -1
      );
    });
    vm.result = correct;
    // Only score if correct and not already scored for this question
    if (correct && typeof vm.answeredCorrectly === "undefined") {
      vm.score++;
      vm.answeredCorrectly = true;
    }
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
