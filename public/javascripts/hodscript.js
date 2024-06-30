document.addEventListener("DOMContentLoaded", function () {
  const formContainer = document.getElementById("formContainer");

  formContainer.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("addProfessorButton")) {
      const professorsContainer = document.createElement("div");
      professorsContainer.classList.add("professors-container");

      const professorInput = document.createElement("input");
      professorInput.type = "text";
      professorInput.placeholder = "Professor";
      professorsContainer.appendChild(professorInput);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("deleteProfessorButton");
      professorsContainer.appendChild(deleteButton);

      // Insert before the next sibling element within the same parent
      target.parentNode.insertBefore(professorsContainer, target.nextSibling);
    } else if (target.classList.contains("deleteProfessorButton")) {
      const professorsContainer = target.parentNode;
      professorsContainer.remove();
    }
  });

  const saveButtons = document.querySelectorAll(".save-button");

  saveButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const row = button.closest("tr");
     
      const sharingTypeSelect = row.querySelector(".sharing-type-select");
      const professorsInputs = row.querySelectorAll(
        ".professors-container input"
      );

      const courseName = row.querySelector("td:nth-child(1)").textContent; // Assuming Course ID is in the second column

      
      const sharingType = sharingTypeSelect.value;
      const professors = Array.from(professorsInputs).map(
        (input) => input.value
      );
      const program=row.querySelector("td:nth-child(9)").textContent;
      if (confirm("Are you sure you want to save")) {
        fetch("/save-course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            program:program,
            courseName: courseName,
            sharingType: sharingType,
            professors: professors,
          }),
        })
          .then((response) => {
            if (response.ok) {
              // Course saved successfully, perform any additional actions here
              alert("Course entries have been updated successfully");
              console.log("Course saved successfully");
            } else {
              // Handle error response
              console.error("Failed to save course");
            }
          })
          .catch((error) => {
            console.error("Error saving course:", error);
          });
      }
    });
  });
});
