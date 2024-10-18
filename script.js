document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("question-container");
  let questions = [];

  // Function to read XLSX file
  async function readXLSX() {
    const response = await fetch("questions.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    // Assume the first sheet is the one we want
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Skip the header row and process the data, filtering out empty rows
    questions = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined)).map((row) => ({
      description: row[0],
      choices: [row[1], row[2], row[3], row[4]],
      correctAnswer: row[5],
    }));

    displayQuestions();
  }

  // Function to display questions
  function displayQuestions() {
    questions.forEach((q, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("question");
      questionDiv.innerHTML = `
        <p><strong>Question ${index + 1}:</strong> ${q.description}</p>
        <div class="choices">
          ${q.choices
            .map(
              (choice, i) => `
              <div class="choice">${i + 1}. ${choice}</div>
            `
            )
            .join("")}
        </div>
        <button id="toggle-answer-${index}">Show Answer</button>
        <div id="correct-${index}" class="correct-answer" style="display: none;">
          Correct Answer: ${q.correctAnswer}
        </div>
      `;
      questionContainer.appendChild(questionDiv);

      // Add event listener to the button
      const button = questionDiv.querySelector(`#toggle-answer-${index}`);
      const correctDiv = questionDiv.querySelector(`#correct-${index}`);

      button.addEventListener("click", () => {
        if (correctDiv.style.display === "none") {
          correctDiv.style.display = "block";
          button.textContent = "Hide Answer";
        } else {
          correctDiv.style.display = "none";
          button.textContent = "Show Answer";
        }
      });
    });
  }

  // Load questions from XLSX
  readXLSX();
});