document.addEventListener("DOMContentLoaded", function () {
    const courses = [];
    const courseForm = document.getElementById("courseForm");
    const courseTableBody = document.querySelector("#courseTable tbody");

    // Load saved data when the page loads
    const savedData = localStorage.getItem("savedCourses");
    if (savedData) {
        courses.push(...JSON.parse(savedData));
        renderCourses();
    }

    // Function to save form data to local storage
    function saveData() {
        localStorage.setItem("savedCourses", JSON.stringify(courses));
    }

    // Function to fetch saved courses from the server and render them
    function fetchAndRenderSavedCourses() {
        fetch("/fetchSavedCourses")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                return response.json();
            })
            .then(savedCourses => {
                // Format data fields
                savedCourses.forEach(course => {
                    // Handle course ID
                    course.id = course.courseCode; // Adjust the property name as per your actual data structure

                    // Handle department
                    course.department = course.department.name; // Assuming 'name' is the property that holds the department's name

                    // Handle number of students
                    course.cseStudents = course.numberOfStudents.CSE; // Adjust the property name as per your actual data structure
                    course.cceStudents = course.numberOfStudents.CCE; // Adjust the property name as per your actual data structure
                    course.mmeStudents = course.numberOfStudents.MME; // Adjust the property name as per your actual data structure
                    course.eceStudents = course.numberOfStudents.ECE; // Adjust the property name as per your actual data structure
                    course.eceDDStudents = course.numberOfStudents.ECE_DD; // Adjust the property name as per your actual data structure
                    course.cseDDStudents = course.numberOfStudents.CSE_DD; // Adjust the property name as per your actual data structure

                    // Handle course type
                    course.courseType = course.courseType || ''; // Ensure courseType is not undefined
                    course.sharingType = course.sharingType || ''; // Ensure sharingType is not undefined
                    // Handle credits
                    course.credits = course.credits; // Adjust the property name as per your actual data structure

                    // Handle professors' names
                    course.professors = course.professors.map(professor => professor.name); // Assuming 'name' is the property that holds the professor's name
                });

                // Filter out deleted courses
                const filteredCourses = savedCourses.filter(course => !course.deleted);
                courses.length = 0;
                courses.push(...filteredCourses);
                renderCourses();
            })
            .catch(error => {
                console.error("Error fetching saved courses:", error);
            });
    }

    function renderCourses() {
        courseTableBody.innerHTML = "";

        courses.forEach((course, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.id}</td>
                <td>${course.department}</td>
                <td>${course.cseStudents}</td>
                <td>${course.cceStudents}</td>
                <td>${course.eceStudents}</td>
                <td>${course.cseDDStudents}</td>
                <td>${course.eceDDStudents}</td>
                <td>${course.mmeStudents}</td>
                <td>${course.credits}</td>
                <td>${course.semester}</td>
                <td>${course.courseType}</td>
                <td>${course.sharingType}</td>
                <td>${course.year}</td>
                <td>${course.professors.join(", ")}</td>
                <td><button class="edit-button" data-index="${index}">Edit</button></td>
                <td><button class="save-button" data-index="${index}">Save</button></td>
                <td><button class="delete-button" data-index="${index}">Delete</button></td>
            `;
            courseTableBody.appendChild(row);
        });

        // Add event listener for edit buttons
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", () => {
                const index = button.getAttribute("data-index");
                editCourse(index);
            });
        });

        // Add event listener for save buttons
        document.querySelectorAll(".save-button").forEach(button => {
            button.addEventListener("click", () => {
                const index = button.getAttribute("data-index");
                saveCourse(index);
            });
        });

        // Add event listener for delete buttons
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", () => {
                const index = button.getAttribute("data-index");
                confirmDelete(index);
            });
        });
    }

    function saveCourse(index) {
        const course = courses[index];
        console.log("Save button clicked for saving :", course); // Debugging statement

        if (confirm("Are you sure you want to save?")) {
            // Save data to local storage
            saveData();

            // Send data to server
            fetch("/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(course)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok.");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Data saved successfully:", data);
                    alert("Hurray! Data saved successfully.");
                })
                .catch(error => {
                    console.error("Error saving data:", error);
                    alert("Error occurred while saving data. Please try again.");
                });
        }
        else {
            // If the user cancels, do nothing
            console.log("Save operation stopped.");
        }
    }

    function deleteCourse(index) {
        const course = courses[index];
        const courseName = course.name; // Assuming the course name is unique and present in the 'name' field

        // Send request to server to delete the course
        fetch("/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ courseName: courseName }) // Send the course name for deletion
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                return response.json();
            })
            .then(data => {
                console.log("Course deleted successfully:", data);
                // Remove the deleted course from the local array and re-render the courses table
                courses.splice(index, 1);
                renderCourses();
            })
            .catch(error => {
                console.error("Error deleting course:", error);
                alert("Error occurred while deleting course. Please try again.");
            });
    }

    function confirmDelete(index) {
        if (confirm("Are you sure you want to delete this course?")) {
            deleteCourse(index);
        }
    }

    function editCourse(index) {
        const course = courses[index];
        const row = document.querySelectorAll("#courseTable tbody tr")[index];

        // Replace the course data in the row with input fields for editing
        row.innerHTML = `
            <td><input type="text" id="editNameInput" value="${course.name}"></td>
            <td><input type="text" id="editCodeInput" value="${course.id}"></td>
            <td><input type="text" id="editDepartmentInput" value="${course.department}"></td>
            <td><input type="text" id="editCseStudentsInput" value="${course.cseStudents}"></td>
            <td><input type="text" id="editCceStudentsInput" value="${course.cceStudents}"></td>
            <td><input type="text" id="editEceStudentsInput" value="${course.eceStudents}"></td>
            <td><input type="text" id="editCseDDStudentsInput" value="${course.cseDDStudents}"></td>
            <td><input type="text" id="editEceDDStudentsInput" value="${course.eceDDStudents}"></td>
            <td><input type="text" id="editMmeStudentsInput" value="${course.mmeStudents}"></td>
            <td><input type="text" id="editCreditsInput" value="${course.credits}"></td>
            <td><input type="text" id="editSemesterInput" value="${course.semester}"></td>
            <td><input type="text" id="editCourseTypeInput" value="${course.courseType}"></td>
            <td><input type="text" id="editSharingTypeInput" value="${course.sharingType}"></td>
            <td><input type="text" id="editYearInput" value="${course.year}"></td>
            <td><input type="text" id="editProfessorsInput" value="${course.professors.join(", ")}"></td>
            <td><button class="update-button" data-index="${index}">Update</button></td>
            <td><button class="cancel-button" data-index="${index}">Cancel</button></td>
        `;

        // Add event listener for update button
        row.querySelector(".update-button").addEventListener("click", () => {
            updateCourse(index);
        });

        // Add event listener for cancel button
        row.querySelector(".cancel-button").addEventListener("click", () => {
            renderCourses();
        });
    }

    function updateCourse(index) {
        const row = document.querySelectorAll("#courseTable tbody tr")[index];

        // Get updated course data from input fields
        const updatedCourse = {
            name: row.querySelector("#editNameInput").value,
            id: row.querySelector("#editCodeInput").value,
            department: row.querySelector("#editDepartmentInput").value,
            cseStudents: row.querySelector("#editCseStudentsInput").value,
            cceStudents: row.querySelector("#editCceStudentsInput").value,
            eceStudents: row.querySelector("#editEceStudentsInput").value,
            cseDDStudents: row.querySelector("#editCseDDStudentsInput").value,
            eceDDStudents: row.querySelector("#editEceDDStudentsInput").value,
            mmeStudents: row.querySelector("#editMmeStudentsInput").value,
            credits: row.querySelector("#editCreditsInput").value,
            semester: row.querySelector("#editSemesterInput").value,
            courseType: row.querySelector("#editCourseTypeInput").value,
            sharingType: row.querySelector("#editSharingTypeInput").value,
            year: row.querySelector("#editYearInput").value,
            professors: row.querySelector("#editProfessorsInput").value.split(", "),
        };

        // Update the course in the array
        courses[index] = updatedCourse;

        // Re-render the courses table
        renderCourses();
    }

    const addEntryButton = document.querySelector('#addEntryButton');

    addEntryButton.addEventListener("click", function () {
        courseForm.style.display = "block";
    });

    const addProfessorButton = document.querySelector('#addProfessorButton');

    addProfessorButton.addEventListener("click", function () {
        const professorsContainer = document.createElement("div");
        professorsContainer.classList.add("professors-container");

        const professorInput = document.createElement("input");
        professorInput.type = "text";
        professorInput.placeholder = "Professor";
        professorsContainer.appendChild(professorInput);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-professor-button");
        deleteButton.addEventListener("click", function () {
            professorsContainer.remove();
        });
        professorsContainer.appendChild(deleteButton);

        courseForm.insertBefore(professorsContainer, addProfessorButton);
    });

    courseForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newCourse = {
            name: document.getElementById("courseNameInput").value,
            id: document.getElementById("courseCodeInput").value,
            department: document.getElementById("departmentSelect").value,
            cseStudents: document.getElementById("cseStudentsInput").value,
            cceStudents: document.getElementById("cceStudentsInput").value,
            eceStudents: document.getElementById("eceStudentsInput").value,
            cseDDStudents: document.getElementById("cseDDStudentsInput").value,
            eceDDStudents: document.getElementById("eceDDStudentsInput").value,
            mmeStudents: document.getElementById("mmeStudentsInput").value,
            credits: document.getElementById("creditsInput").value,
            semester: document.getElementById("semesterSelect").value,
            courseType: document.getElementById("courseTypeSelect").value,
            sharingType: document.getElementById("sharingTypeSelect").value,
            year: document.getElementById("yearSelect").value,
            professors: Array.from(document.querySelectorAll(".professors-container input")).map(input => input.value),
        };

        if (!newCourse.name || !newCourse.id || !newCourse.department || !newCourse.cseStudents || !newCourse.cceStudents || !newCourse.eceStudents || !newCourse.cseDDStudents || !newCourse.eceDDStudents || !newCourse.mmeStudents || !newCourse.semester || !newCourse.courseType || !newCourse.year) {
            alert("Please fill in all required fields");
            return;
        }

        courses.push(newCourse);
        renderCourses();
        resetForm();
    });

    function resetForm() {
        courseForm.reset();
        courseForm.style.display = "none";
        document.querySelectorAll(".professors-container").forEach(container => container.remove());
    }

    document.getElementById('generateButton').addEventListener('click', async () => {
        try {
            const response = await fetch('/generate-timetable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            alert(data.message); // Display success message
        } catch (error) {
            console.error('Error generating timetable:', error);
            alert('Error generating timetable. Please try again.');
        }
    });

    document.getElementById('viewTimetableButton').addEventListener('click', function() {
        // Redirect the user to the /timetable route
        window.location.href = '/timetable';
    });

    // Optional: Add event listener for logout button
    // document.querySelector("form[action='/logout']").addEventListener("submit", function() {
    //     // Logout logic goes here
    // });

    // Call fetchAndRenderSavedCourses to render saved courses
    fetchAndRenderSavedCourses();
});
