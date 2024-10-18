document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("question-container");
  let questions = [];

  // Function to read XLSX files
  async function readXLSXFiles() {
    const filePattern = "*_questions.xlsx"; // Adjust the pattern as needed
    const files = await fetchFiles(filePattern);

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      // Assume the first sheet is the one we want
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Skip the header row and process the data, filtering out empty rows
      const fileQuestions = jsonData
        .slice(1)
        .filter((row) => row.some((cell) => cell !== undefined))
        .map((row) => {
          const description = row[1];
          const choices = row.slice(2, 7);
          const correctAnswer = row[7];
          return { description, choices, correctAnswer };
        });

      questions = questions.concat(fileQuestions);
    }

    displayQuestions();
  }

  // Function to fetch files based on a pattern
  async function fetchFiles(pattern) {
    // This is a placeholder function. You need to implement the logic to fetch files based on the pattern.
    // For example, you can use a server-side script to list files matching the pattern and return them.
    // Here, we'll assume you have a predefined list of files.
    const fileNames = [
      "1_questions.xlsx",
      "2_questions.xlsx",
      "3_questions.xlsx",
      "4_questions.xlsx",
      "5_questions.xlsx",
    ]; // Add more file names as needed
    const files = await Promise.all(
      fileNames.map((fileName) => fetch(fileName))
    );
    return files;
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
              <div class="choice">${i + 1}. ${choice || ""}</div>
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

  // Load questions from XLSX files
  readXLSXFiles();
});
