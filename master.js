
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpan = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answer-area");
let submitBtn = document.querySelector(".submit-btn");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let topic = document.getElementById("topic");
topic.textContent = localStorage.getItem("quizChoose");

let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;
let choosenOpt = localStorage.getItem("quizChoose");
console.log(choosenOpt);


function getQuestions () {
    fetch(`./${choosenOpt}Questions.json`).then((res) => {
        return res.json()
    }).then((data) => {
        newData = data.questions;
        console.log(newData);
        let questionsCount = newData.length;
        // console.log(questionsCount);
        createBullets(questionsCount);

        addQuestionData(newData[currentIndex] , questionsCount);
        
        countdown(10, questionsCount);

        submitBtn.onclick = () => {
            countSpan.textContent --;
            let rightAnswer = newData[currentIndex].answer
            // console.log(rightAnswer);
            currentIndex++;
            // check answer
            checkAnswer(rightAnswer , questionsCount);
            // remove old question
            quizArea.textContent = "";
            answersArea.textContent = "";
            // to go to the next question
            addQuestionData(newData[currentIndex] , questionsCount);
            // handel class bullets
            handelBullets();

            clearInterval(countdownInterval);
            countdown(10, questionsCount);

            //show result
            showResults(questionsCount);

        }

    })
}
getQuestions();

function createBullets (num) {
    countSpan.textContent = num;

    for(let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if (i === 0) {
            theBullet.className = "on";
        }
        bulletsSpan.appendChild(theBullet)
    }
}

function addQuestionData(obj , count) {
    if(currentIndex < count) {
        // console.log(obj.options[1]);
        // console.log(count);
        let questionTitile = document.createElement("h3");
        let questionText = document.createTextNode(obj.question);

        questionTitile.appendChild(questionText);
        quizArea.appendChild(questionTitile);
        // answers 
        for (let i = 0; i < 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = 'answer';
            let radioInput = document.createElement("input");
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `options[${i}]`;
            // radioInput.id = `answer_${id}`;
            radioInput.dataset.answer = obj.options[i];
            // console.log(obj.options[i]);
            // first one checked
            if (i === 0) {
                radioInput.checked = true;
            }
            let theLabel = document.createElement("label");
            theLabel.htmlFor = `options[${i}]`;
            let theLabelText = document.createTextNode(obj.options[i])
            theLabel.appendChild(theLabelText);
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer (rAnswer , qCount) {
    // console.log(rAnswer);
    // console.log(qCount);
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    // console.log("the r" + rAnswer);
    // console.log(theChoosenAnswer);
    if (rAnswer === theChoosenAnswer) {
        rightAnswer++;
    }
    
}

function handelBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    // console.log(bulletsSpans);
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span , index) => {
        if(currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResults(count) {
    let theResults = document.createElement("span");
    if (currentIndex === count) {
        // console.log("finised");
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();
        if(rightAnswer > (count/2) && rightAnswer < count) {
            theResults.className = "good";
            theResults.textContent = `Good, you answered ${rightAnswer} from ${count}`
        } else if (rightAnswer === count) {
            theResults.className = "perfect";
            theResults.textContent = `perfect, all answers is right`
        } else {
            theResults.className = "bad";
            theResults.textContent = `bad luck, you only answered ${rightAnswer} of ${count} right`
        }
        resultsContainer.appendChild(theResults);
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minuts, seconds;
        countdownInterval = setInterval(() => {
            minuts = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minuts = minuts < 10 ? `0${minuts}` : minuts;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            // try not to use innerhtml
            countdownElement.innerHTML = `${minuts}:${seconds}`

            if(--duration < 0) {
                clearInterval(countdownInterval)
                submitBtn.click();
                
            }

        }, 1000);
    }
}
