// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
const userAccount = {
    "Username": "User-5E638711-2D64-47B0-A8F5-1C5A9EADA966",
    "Password": "Pass-E4A679C7-2F4B-40AE-9DC8-C967EF7215AE"
};
var tableBody = document.getElementById("entityTableBody");
tableBody.innerHTML = '';
var token = "";
var zaman = new Date();
function VerileriTabloyaEkle(veri) {

    

    veri.forEach(entity => { 
        var row = document.createElement('tr');
        row.setAttribute('data-id', entity.id);

        var idCell = document.createElement('td');
        var recipientCell = document.createElement('td');
        var recipientTypeCell = document.createElement('td');
        var statusCell = document.createElement('td');
        var typeCell = document.createElement('td');


        idCell.innerText = entity.id;
        typeCell.innerText = entity.type;
        recipientCell.innerText = entity.recipient;
        statusCell.innerText = entity.status;
        recipientTypeCell.innerText = entity.recipientType;


        row.appendChild(idCell);
        row.appendChild(recipientCell);
        row.appendChild(recipientTypeCell);
        row.appendChild(statusCell);
        row.appendChild(typeCell);

        var actionsCell = document.createElement('td');

        if (entity.id !== null) {
            var editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.className = "editButton"
            editButton.onclick = function () {
                editRow(this);
            };
            actionsCell.appendChild(editButton);

            var deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'deleteButton';
            deleteButton.onclick = function () {
                deleteRow(this);
            };
            actionsCell.appendChild(deleteButton);

            var saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.className = 'edit-buttons';
            saveButton.style.display = 'none';
            saveButton.onclick = function () {
                saveRow(this);
            };
            actionsCell.appendChild(saveButton);

            var cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.className = 'edit-buttons';
            cancelButton.style.display = 'none';
            cancelButton.onclick = function () {
                cancelEdit(this);
            };
            actionsCell.appendChild(cancelButton);
        }

        row.appendChild(actionsCell);

        tableBody.prepend(row);
    });


}

function editRow(button) {
    var row = button.closest('tr');
    row.classList.add('edit-mode');

    var cells = row.cells;
    for (var i = 1; i < cells.length - 1; i++) {
        var cell = cells[i];
        var value = cell.innerText;
        cell.innerHTML = '<input type="text" class="edit-input" value="' + value + '">';
    }

    var editButtons = row.querySelectorAll('.edit-buttons');
    editButtons.forEach(function (button) {
        button.style.display = 'inline-block';
    });

    row.querySelector(".deleteButton").style.display = "none";

    button.style.display = 'none';
}

function saveRow(button) {
    var row = button.closest('tr');
    var inputs = row.querySelectorAll('.edit-input');
    var updatedData = {};
    var headers = document.querySelectorAll('#entityTable th');
    updatedData["Id"] = parseInt(row.getAttribute('data-id'));
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var value = input.value;
        row.cells[i+1].innerText = value;
        var columnName = headers[i+1].innerText.trim();

        updatedData[columnName] = value;

    }
     fetch(`https://localhost:44338/api/Consents`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }, body: JSON.stringify(updatedData)
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return;
    }).catch(err => {
        console.log(err)
    });

    row.classList.remove('edit-mode');

    var editButtons = row.querySelectorAll('.edit-buttons');
    editButtons.forEach(function (button) {
        button.style.display = 'none';
    });

    var editButtonss = row.querySelectorAll('.editButton , .deleteButton');
    editButtonss.forEach(function (button) {
        button.style.display = "inline-block";
    });
}

function cancelEdit(button) {
    var row = button.closest('tr');
    var inputs = row.querySelectorAll('.edit-input');

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var value = input.getAttribute('value');
        row.cells[i+1].innerText = value;
    }

    row.classList.remove('edit-mode');

    var editButtons = row.querySelectorAll('.edit-buttons');
    editButtons.forEach(function (button) {
        button.style.display = 'none';
    });

    var editButtonss = row.querySelectorAll('.editButton , .deleteButton');
    editButtonss.forEach(function (button) {
        button.style.display = "inline-block";
    });
}

function deleteRow(button) {
    var row = button.closest('tr');
    var id = row.getAttribute('data-id');
    fetch(`https://localhost:44338/api/Consents/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return
        })
        .then(() => {
            console.log('Silme başarılı:');
            row.remove();
        })
        .catch(error => {
            console.error('Silme hatası:', error);
        });
}

var form = document.getElementById("consentsForm");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(form);
    var yeniKayit = {};
    formData.forEach(function (value, key) {
        yeniKayit[key] = value;
    });

    fetch("https://localhost:44338/api/Consents/CreateContents", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(yeniKayit)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Kayıt eklenemedi');
            }
            return response.json();
        })
        .then(data => {
            VerileriTabloyaEkle([data]);
            form.reset();
        })
        .catch(error => {
            console.error('Hata:', error);
        });
});


fetch("https://localhost:44338/api/User/authenticate", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(userAccount)
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Token alınamadı');
        }
        return response.json();
    })
    .then(async tokenData => {
        token = tokenData.jwtToken;
        for (var i = 0; i <= 1000; i += 10) {
             await fetch("https://localhost:44338/api/Consents", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify({
                    StartId: i,
                    Count: 10
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Veri alınamadı');
                    }
                    return response.json();
                })
                .then(veri => {
                    VerileriTabloyaEkle(veri);
                })
                .catch(error => {
                    console.error('Hata:', error);
                });
            VerileriTabloyaEkle([{
                id: null,
                type: null,
                recipientType: null,
                status:null,
                recipient: zaman.toLocaleTimeString()
            }])
        }
    }).catch(error => {
        console.error('Token alınamadı:', error);
    });
