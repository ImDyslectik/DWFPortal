document.addEventListener("DOMContentLoaded", function() {
    initFileClipboard();
    initSearchUsersEmailList();
    initProjectFormAddEvent();
    initSortableColumns();
    filterAndResetProjects();
    changeDealOwner();
});

function initFileClipboard() {
    let emailElements = document.querySelectorAll(".card-email");

    emailElements.forEach(element => {
        element.addEventListener("click", function(event) {
            event.stopPropagation();
            let email = event.target.textContent.split(": ")[1];
            writeToClipboard(email);
        });
    });
}

function writeToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Email copied to clipboard');
        })
        .catch(err => {
            console.error('Could not copy email: ', err);
        });
}

function initSearchUsersEmailList() {
    document.querySelector('#dealOwnerEmail').addEventListener('input', async function() {
        const searchTerm = this.value;
        const response = await fetch(`/search-users?term=${searchTerm}`);
        const emailList = await response.json();

        const dataList = document.querySelector('#emailList');
        dataList.innerHTML = "";

        emailList.forEach(email => {
            const option = document.createElement('option');
            option.value = email;
            dataList.appendChild(option);
        });
    });
}

function filterAndResetProjects() {
    const items = document.querySelectorAll('.column-item');

    function filterProjects() {
        const filterValue = document.querySelector('.search-text').value.toLowerCase();

        Array.from(items).forEach(function(item) {
            const projectNameElement = item.querySelector('.card-title');
            const projectName = projectNameElement ? projectNameElement.innerText.toLowerCase() : '';

            if (filterValue === '' || projectName.includes(filterValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        if (filterValue === '') {
            resetProjects();
        }
    }

    function resetProjects() {
        Array.from(items).forEach(function(item) {
            item.style.display = 'block';
        });
    }

    document.getElementById('exportDate').addEventListener('change', function() {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/save", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("exportDate=" + this.value);
    });

    document.querySelector('.search-text').addEventListener('input', filterProjects);
    document.querySelector('.reset-btn').addEventListener('click', function() {
        document.querySelector('.search-text').value = '';
        resetProjects();
    });
}

function initProjectFormAddEvent() {
    document.getElementById('addProjectForm').addEventListener('submit', function(event) {
        const name = document.getElementById('name').value;
        const companyEmail = document.getElementById('companyEmail').value;
        const dealOwnerEmail = document.getElementById('dealOwnerEmail').value;
        const stage = document.getElementById('stage').value;
        event.preventDefault();

        axios.post('/addProject', {
            name: name,
            companyEmail: companyEmail,
            dealOwnerEmail: dealOwnerEmail,
            stage: stage,
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function() {
                location.reload();
            });
    });
}

function changeDealOwner() {
    const buttons = document.querySelectorAll('.button-basic');

    buttons.forEach((button) => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();

            const container = button.parentElement;

            container.innerHTML = "";

            const input = document.createElement('input');
            input.classList.add('modal-input');
            input.type = 'text';
            input.placeholder = 'Nieuwe Deal Owner';
            container.appendChild(input);

            const dataList = document.createElement('datalist');
            dataList.id = 'emailList';
            container.appendChild(dataList);

            const saveButton = document.createElement('button');
            saveButton.innerHTML = '&#10003;';
            saveButton.classList.add("button-basic");
            saveButton.addEventListener('click', async function() {
                const newOwner = input.value;
                const ownerId = button.dataset.id;

                const response = await fetch('/updateOwner', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ownerId, newOwner }),
                });

                if (!response.ok) {
                    console.error("Error updating owner:", await response.text());
                } else {
                    container.innerHTML = `Deal Owner: ${newOwner}`;
                    location.reload();
                }
            });
            container.appendChild(saveButton);
        });
    });
}

function initSortableColumns() {
    document.querySelectorAll('.sortable').forEach(sortable => {
        Sortable.create(sortable, {
            group: {
                name: 'sortable',
                pull: true,
                put: true
            },
            animation: 100,
            onAdd: function(event) {
                const item_id = event.item.dataset.id;
                const new_stage = event.to.id;

                fetch('/update-project', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: item_id,
                        stage: new_stage
                    }),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                    })
                    .catch(error => {
                        console.error(`Fetch error: ${error}`);
                    });
            },
        });
    });
}