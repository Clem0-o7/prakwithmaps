let answers = {};

function askQuestions() {
    const questions = [
        "1. How would you describe your body build?",
        "2. What is your typical body temperature? (Hot, Cold, Moderate)",
        "3. How is your digestion? (Irregular, Strong, Sensitive)",
        "4. What best describes your sleep pattern? (Light, Moderate, Deep)",
        "5. How do you handle stress? (Anxious, Irritable, Calm)"
    ];

    let chatContent = "";
    for (const question of questions) {
        chatContent += `<p><strong>Bot:</strong> ${question}</p>`;
    }

    document.getElementById("chat").innerHTML = chatContent;
}

function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const chatContent = document.getElementById("chat").innerHTML;

    if (!userInput.trim()) {
        alert("Please enter a valid answer.");
        return;
    }

    const currentQuestion = chatContent.match(/<strong>Bot:<\/strong> (.*)/)[1];
    storeAnswer(currentQuestion, userInput);

    const nextQuestionIndex = getNextQuestionIndex(currentQuestion);
    if (nextQuestionIndex !== -1) {
        const nextQuestion = questions[nextQuestionIndex];
        document.getElementById("chat").innerHTML += `<p><strong>User:</strong> ${userInput}</p>`;
        document.getElementById("chat").innerHTML += `<p><strong>Bot:</strong> ${nextQuestion}</p>`;
    } else {
        determinePrakritiDosha();
    }

    document.getElementById("userInput").value = "";
}

function storeAnswer(question, answer) {
    const questionKey = getQuestionKey(question);
    if (!answers[questionKey]) {
        answers[questionKey] = [];
    }
    answers[questionKey].push(answer);
}

function getQuestionKey(question) {
    return question.split(' ')[1].toLowerCase().replace(/[^\w\s]/gi, '');
}

function getNextQuestionIndex(currentQuestion) {
    return questions.indexOf(currentQuestion) + 1;
}

function determinePrakritiDosha() {
    // Perform calculations or analysis based on the user's answers to determine the dosha
    // This is a simple example; you might want to consult Ayurvedic principles for a more accurate approach
    const vataCount = answers["bodybuild"].filter(answer => answer.toLowerCase() === "slim").length +
        answers["bodytemperature"].filter(answer => answer.toLowerCase() === "cold").length;

    const pittaCount = answers["bodytemperature"].filter(answer => answer.toLowerCase() === "hot").length +
        answers["digestion"].filter(answer => answer.toLowerCase() === "strong").length +
        answers["sleeppattern"].filter(answer => answer.toLowerCase() === "moderate").length;

    const kaphaCount = answers["bodybuild"].filter(answer => answer.toLowerCase() === "heavy").length +
        answers["digestion"].filter(answer => answer.toLowerCase() === "sensitive").length +
        answers["sleeppattern"].filter(answer => answer.toLowerCase() === "deep").length +
        answers["stresshandling"].filter(answer => answer.toLowerCase() === "calm").length;

    let result = "";
    if (vataCount > pittaCount && vataCount > kaphaCount) {
        result = "Your dominant dosha is Vata.";
    } else if (pittaCount > vataCount && pittaCount > kaphaCount) {
        result = "Your dominant dosha is Pitta.";
    } else {
        result = "Your dominant dosha is Kapha.";
    }

    document.getElementById("chat").innerHTML += `<p><strong>Bot:</strong> ${result}</p>`;
}

// Example usage
askQuestions();
