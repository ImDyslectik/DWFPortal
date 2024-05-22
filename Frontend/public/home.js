function handleDragOver(event) {
    event.preventDefault();
}

function handleDragEnter(event) {
    event.preventDefault();
    document.getElementById('dropArea').classList.add('invalid');
}

function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('dropArea').classList.remove('invalid');
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
    document.getElementById('dropArea').classList.remove('invalid');
}

function selectFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleFile(file);
    });

    fileInput.click();
}

function handleFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Bestand formaat niet herkend.');
            }
        })
        .then(message => {
            console.log(message);
            console.log('Bestandnaam:', file.name);
            document.getElementById('message').textContent = `Bestand "${file.name}" succesvol geüpload!`;
            document.getElementById('message').classList.remove('error');
        })
        .catch(error => {
            console.error(error);
            document.getElementById('message').textContent = error.message;
            document.getElementById('message').classList.add('error');
        });
}

window.onload = function() {
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

    document.getElementById('addProjectForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const companyEmail = document.getElementById('companyEmail').value;
        const dealOwnerEmail = document.getElementById('dealOwnerEmail').value;
        const stage = document.getElementById('stage').value;

        axios.post('/addProject', {
                name: name,
                companyEmail: companyEmail,
                dealOwnerEmail: dealOwnerEmail,
                stage: stage,
            },
        )
            .then(function (response) {
                console.log(response);
                console.log(projectName)
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    document.querySelectorAll('.sortable').forEach(sortable => {
        Sortable.create(sortable, {
            group: {
                name: 'sortable',
                tolerance: "pointer",
                pull: true,
                put: true
            },
            animation: 100,
            onAdd: function (event) {
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