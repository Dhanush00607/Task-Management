// Function to show divisions with delay
function showDivisionsWithDelay() {
    const cardDivisions = document.querySelectorAll(".card");
    const delay = 300;

    cardDivisions.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = 1;
        }, (index + 1) * delay);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('duedate').valueAsDate = new Date();
    const taskContainer = document.getElementById("TaskContainer");
    const addButton = document.querySelector(".bx-plus");
    const textInput = document.getElementById("todo");
    const descriptionInput = document.getElementById("description"); // New description input
    const dateInput = document.getElementById("duedate");
    const myDayLink = document.getElementById("o1");
    const thisWeekLink = document.getElementById("o2");
    const thisMonthLink = document.getElementById("o3");
    const otherLink = document.getElementById("o4");
    const editLink = document.getElementById("o5");
    const titleLink = document.getElementById("header_title");

    let currentSection = "myDay"; // Declare currentSection globally

    // Function to generate a unique numeric ID
    const generateNumericID = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
    };

    // Function to handle data submission
    const saveData = () => {
        const taskDescription = textInput.value;
        const taskDate = dateInput.value;
        const taskDueDate = new Date(taskDate).toLocaleDateString("en-CA");

        // Check if both text and date are entered before saving
        if (taskDescription.trim() === "" || taskDate === "") {
            swal({
                title: "Error",
                text: "Please enter both task and due date!",
                icon: "error",
            });
        } else {
            // Generate a unique numeric ID
            const id = generateNumericID();

            // Create a new object representing the to-do task
            const task = {
                id: id,
                text: taskDescription,
                description: descriptionInput.value, // Save task description
                date: taskDueDate,
                completed: false,
                timestamp: Date.now(), // Shortened timestamp in milliseconds
            };

            // Convert the task object to a JSON string
            const taskData = JSON.stringify(task);

            // Save the JSON data to LocalStorage with the unique ID as the key
            localStorage.setItem(id, taskData);

            // Clear the text and date inputs after saving
            textInput.value = "";
            descriptionInput.value = ""; // Clear description input
            dateInput.value = "";
            displayTasks(currentSection);
        }
    };

    addButton.addEventListener("click", saveData);

    // Add keypress event listener to the text input and date input
    textInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            saveData();
        }
    });

    descriptionInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            saveData();
        }
    });

    dateInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            saveData();
        }
    });

    // Function to check if a date is today
    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.toDateString() === today.toDateString();
    };

    // Function to retrieve tasks from LocalStorage and display them
    const displayTasks = (section, tasksToDisplay) => {
        currentSection = section;
        const tasks = Object.entries(localStorage)
            .filter(([key]) => key !== "userPreferences")
            .map(([, tasks]) => JSON.parse(tasks));
        const tasksToRender = tasksToDisplay || tasks;
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        const todayDate = new Date().toLocaleDateString("en-CA");

        // Filter tasks based on the selected section
        const filteredTasks = tasksToRender.filter((task) => {
            switch (section) {
                case "myDay":
                    titleLink.textContent = "My Day";
                    return task.date === todayDate;
                case "thisWeek":
                    titleLink.textContent = "Current Week";
                    const getStartOfWeek = (date) => {
                        const day = date.getDay();
                        return new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate() - day
                        );
                    };

                    const getEndOfWeek = (date) => {
                        const day = date.getDay();
                        return new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate() + (6 - day)
                        );
                    };

                    const today = new Date();
                    const startOfWeek = getStartOfWeek(today);
                    const endOfWeek = getEndOfWeek(today);

                    const taskDate = new Date(task.date); // Convert task.date to a Date object for comparison

                    return taskDate >= startOfWeek && taskDate <= endOfWeek;
                case "thisMonth":
                    titleLink.textContent = "Current Month";
                    const getStartOfMonth = (date) => {
                        return new Date(date.getFullYear(), date.getMonth(), 1);
                    };

                    // Function to get the end date of the current month
                    const getEndOfMonth = (date) => {
                        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    };
                    const startOfMonth = getStartOfMonth(new Date());
                    const endOfMonth = getEndOfMonth(new Date());
                    return (
                        task.date >= startOfMonth.toISOString().slice(0, 10) &&
                        task.date <= endOfMonth.toISOString().slice(0, 10)
                    );
                case 'EditTasks':
                    titleLink.textContent = "Edit Tasks";
                    return true; // Return all tasks for editing
                case "other":
                    titleLink.textContent = "All tasks";
                    return true;
                default:
                    return false;
            }
        });

        taskContainer.innerHTML = filteredTasks
            .map(
                (task) => `
          <div class="card align" data-task-id="${task.id}">
            <input type="checkbox" name="task" id="${task.id}" ${task.completed ? "checked" : ""}>
            <div ${task.completed ? 'class="marker done"' : 'class="marker"'}>
              <span>${task.text}</span>
              <p class="description">${task.description}</p> <!-- Display task description -->
              <p id="taskDate" class="date ${isToday(task.date) ? "today" : ""}">${isToday(task.date)
                    ? "Today"
                    : "<i class='bx bx-calendar-alt'></i> " + task.date}</p>
              <input type="date" id="hiddenDatePicker" style="display: none;" />
            </div>
            <i class="bx bx-trash-alt"></i>
          </div>
        `
            )
            .join("");
            const searchInput = document.getElementById("search");

            // Function to handle the search input and filter tasks
            const handleSearch = () => {
                toggleMenu();
                const searchText = searchInput.value.trim().toLowerCase();
                if (searchText !== "") {
                    // Filter tasks based on the search text
                    const filteredTasks = tasks.filter((task) =>
                        task.text.toLowerCase().includes(searchText)
                    );
                    displayTasks(currentSection, filteredTasks);
                } else {
                    // If the search text is empty, display all tasks
                    displayTasks(currentSection);
                }
            };
            
            
            // Add keydown event listener to the search input
            const keydownHandler = (event) => {
                if (event.key === "Enter") {
                    handleSearch();
                    searchInput.removeEventListener("keydown", keydownHandler);
                }
            };
            
            // Add keydown event listener to the search input
            searchInput.addEventListener("keydown", keydownHandler);
            

        // Add event listener for description click
        taskContainer.addEventListener("click", (event) => {
            // Handle description click
            if (event.target.classList.contains("description")) {
                const descriptionElement = event.target;
                const taskId = descriptionElement.closest(".card").dataset.taskId;
                const task = tasks.find((task) => task.id.toString() === taskId);

                // Prompt the user to edit the description
                swal({
                    title: "Edit Description",
                    content: {
                        element: "input",
                        attributes: {
                            placeholder: "Enter new description",
                            type: "text",
                            value: task.description
                        }
                    },
                    buttons: {
                        cancel: "Cancel",
                        confirm: "Save"
                    }
                }).then((value) => {
                    if (value) {
                        // Update the description in local storage
                        task.description = value;
                        localStorage.setItem(taskId, JSON.stringify(task));

                        // Refresh the display
                        displayTasks(currentSection);
                    }
                });
            }
        });

        // Show divisions with delay after rendering tasks
        showDivisionsWithDelay();
    };

    const buttonsDiv = document.querySelector(".buttons");
    buttonsDiv.addEventListener("click", () => {
        swal({
            title: "Delete all data?",
            text: "Once deleted, you will not be able to recover this data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                // Get all keys from localStorage
                const keys = Object.keys(localStorage);

                // Filter out the userPreferences key
                const keysToKeep = keys.filter(key => key !== "userPreferences");

                // Clear localStorage except for userPreferences
                keysToKeep.forEach(key => localStorage.removeItem(key));

                // Clear the taskContainer
                taskContainer.innerHTML = "";

                swal("All data has been deleted!", {
                    icon: "success",
                });
            }
        });
    });

    const logoutLink = document.getElementById("logoutLink");

    logoutLink.addEventListener("click", () => {
        swal({
            title: "Are you sure?",
            text: "Logging out will delete your profile name and email.",
            icon: "warning",
            buttons: ["Cancel", "Logout"],
            dangerMode: true,
        }).then((willLogout) => {
            if (willLogout) {
                // User clicked "Logout"
                // Remove user preferences from local storage
                localStorage.removeItem("userPreferences");

                // Refresh the current page
                window.location.reload();
            } else {
                // User clicked "Cancel"
                // Do nothing or handle accordingly
            }
        });
    });

    function getUserPreferences() {
        const storedPreferences = localStorage.getItem("userPreferences");
        const defaultPreferences = {
            name: "John Doe",
            email: "john@gmail.com",
        };

        return storedPreferences
            ? JSON.parse(storedPreferences)
            : defaultPreferences;
    }

    // Function to set user preferences in localStorage
    function setUserPreferences(name, email) {
        const preferences = { name, email };
        localStorage.setItem("userPreferences", JSON.stringify(preferences));
    }

    // Function to prompt the user for their name and email using SweetAlert
    function promptForNameAndEmail() {
        swal({
            title: "Enter your information",
            content: {
                element: "div",
                attributes: {
                    innerHTML: `
          <div class="form__group field">
            <input type="input" class="form__field" placeholder="Name" id="swal-input-name" required="">
            <label for="swal-input-name" class="form__label">Name</label>
          </div>
          <div class="form__group field">
            <input type="input" class="form__field" placeholder="Email" id="swal-input-email" required="">
            <label for="swal-input-email" class="form__label">Email</label>
          </div>
        `,
                },
            },
            buttons: {
                cancel: "Cancel",
                confirm: "Save",
            },
            closeOnClickOutside: false,
        }).then((result) => {
            if (result && result.dismiss !== "cancel") {
                const name = document.getElementById("swal-input-name").value;
                const email = document.getElementById("swal-input-email").value;

                // Set default values if the user didn't enter any details
                const finalName = name || "Dhanush";
                const finalEmail = email || "Dhanush@gmail.com";

                setUserPreferences(finalName, finalEmail);
                displayProfileData();
            }
        });
    }

    // Function to display user profile data
    function displayProfileData() {
        const preferences = getUserPreferences();

        const nameElement = document.getElementById("name");
        const emailElement = document.getElementById("email");

        nameElement.textContent = preferences.name;
        emailElement.textContent = preferences.email;
    }

    // Check if user preferences are already set
    const preferences = getUserPreferences();

    if (
        preferences.name === "John Doe" &&
        preferences.email === "john@gmail.com"
    ) {
        // If preferences are default, prompt the user for their name and email
        promptForNameAndEmail();
    }

    // Call the function to display profile data
    displayProfileData();


    // Function to handle section link click and display tasks
    const handleSectionLinkClick = (section, linkElement) => {
        displayTasks(section);
        toggleMenu();

        // Remove the event listener for the clicked section link
        linkElement.removeEventListener("click", () => handleSectionLinkClick(section, linkElement));
    };

    function initializeApp() {
        // Your application logic goes here...
    }

    // Event listeners for section links
    myDayLink.addEventListener("click", function () { handleSectionLinkClick("myDay", myDayLink); });
    thisWeekLink.addEventListener("click", function () { handleSectionLinkClick("thisWeek", thisWeekLink); });
    thisMonthLink.addEventListener("click", function () { handleSectionLinkClick("thisMonth", thisMonthLink); });
    otherLink.addEventListener("click", function () { handleSectionLinkClick("other", otherLink); });
    editLink.addEventListener("click", function () { handleSectionLinkClick("EditTasks", editLink); });
    displayTasks(currentSection);

    const burgerIcon = document.getElementById('burgerIcon');
    const containerLeft = document.getElementById('containerLeft');

    const toggleMenu = () => {
        containerLeft.classList.toggle('v-class');
        burgerIcon.classList.toggle('cross');
    };

    burgerIcon.addEventListener('click', toggleMenu);

    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // Check if the clicked element is not inside the containerLeft
        if (!containerLeft.contains(target) && !burgerIcon.contains(target)) {
            containerLeft.classList.remove('v-class');
            burgerIcon.classList.remove('cross');
        }
    });



});

