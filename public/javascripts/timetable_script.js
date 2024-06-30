document.addEventListener("DOMContentLoaded", function() {
    // Function to handle editing
    function editButtonHandler(event) {
        const row = event.target.closest('tr');
        const cells = row.querySelectorAll('td:not(:last-child)'); // Select all cells except the action cell

        cells.forEach((cell, index) => {
            if(index !== 2) { // Assuming index 2 is professors to avoid complex innerHTML due to line breaks
                const input = document.createElement('input');
                input.type = 'text';
                input.value = cell.innerText;
                cell.innerHTML = '';
                cell.appendChild(input);
            }
        });

        // Change Edit button to Save button
        event.target.textContent = 'Save';
        event.target.classList.add('save-button');
        event.target.removeEventListener('click', editButtonHandler);
        event.target.addEventListener('click', saveChanges);
    }

    // Function to handle saving
    function saveChanges(event) {
        const row = event.target.closest('tr');
        const inputs = row.querySelectorAll('input');
        const updatedEntry = {
            course: inputs[0].value,  // Example, adjust according to actual structure
            section: inputs[1].value,
            lectureHall:inputs[3].value,
            startTime:inputs[4].value,
            endTime:inputs[5].value,


            // Add all necessary properties
        };
    
        fetch('/update-timetable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEntry)
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            // Update UI here
        })
        .catch(error => console.error('Error:', error));
    }
    

    // Bind initial edit buttons to the editButtonHandler
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', editButtonHandler);
    });
});
