const modalForm = document.getElementById('modal');
const openModalButton = document.querySelector('.formButton');
const closeModalButton = document.getElementById('closeModal');
const vehicleForm = document.getElementById('vehicleForm');
const vehicleTableBody = document.getElementById('vehicleTableBody');
let map;
let marker;

// Dados armazenados localmente
let vehicleData = JSON.parse(localStorage.getItem('vehicleData')) || [];


function logHistory(action, placa) {
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR'); 
    const time = now.toLocaleTimeString('pt-BR'); 
    const history = JSON.parse(localStorage.getItem('vehicleHistory')) || [];

    const message = `Veículo ${placa.toUpperCase()} ${action.toUpperCase()} em ${date} às ${time}`;
    history.push(message);
    localStorage.setItem('vehicleHistory', JSON.stringify(history));
}

openModalButton.addEventListener('click', () => {
    modalForm.style.display = 'flex';
    initializeMap();
});

closeModalButton.addEventListener('click', () => {
    modalForm.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modalForm) {
        modalForm.style.display = 'none';
    }
});

vehicleForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const placa = document.getElementById('placa').value;
    const modelo = document.getElementById('modelo').value;
    const cor = document.getElementById('cor').value;
    const marca = document.getElementById('marca').value;
    const ano = document.getElementById('ano').value;
    const proposito = document.getElementById('proposito').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    const vehicle = { placa, modelo, cor, marca, ano, proposito, latitude, longitude };
    vehicleData.push(vehicle);
    saveToLocalStorage();
    updateVehicleTable();
    logHistory("Cadastro realizado para", placa); 
    modalForm.style.display = 'none';
    vehicleForm.reset();
    resetMap();
});

function updateVehicleTable() {
    vehicleTableBody.innerHTML = '';
    if (vehicleData.length === 0) {
        vehicleTableBody.innerHTML = '<tr><td colspan="8">Nenhum veículo cadastrado.</td></tr>';
    } else {
        vehicleData.forEach((vehicle, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.placa}</td>
                <td>${vehicle.modelo}</td>
                <td>${vehicle.cor}</td>
                <td>${vehicle.marca}</td>
                <td>${vehicle.ano}</td>
                <td>${vehicle.proposito}</td>
                <td>${vehicle.latitude}, ${vehicle.longitude}</td>
                <td>
                    <button onclick="editVehicle(${index})">Editar</button>
                    <button onclick="deleteVehicle(${index})">Excluir</button>
                </td>
            `;
            vehicleTableBody.appendChild(row);
        });
    }
}

function editVehicle(index) {
    const vehicle = vehicleData[index];
    document.getElementById('placa').value = vehicle.placa;
    document.getElementById('modelo').value = vehicle.modelo;
    document.getElementById('cor').value = vehicle.cor;
    document.getElementById('marca').value = vehicle.marca;
    document.getElementById('ano').value = vehicle.ano;
    document.getElementById('proposito').value = vehicle.proposito;
    document.getElementById('latitude').value = vehicle.latitude;
    document.getElementById('longitude').value = vehicle.longitude;

    modalForm.style.display = 'flex';
    vehicleData.splice(index, 1); 
    logHistory("Edição iniciada para", vehicle.placa); 
    saveToLocalStorage();
    updateVehicleTable();
}

function deleteVehicle(index) {
    const deletedVehicle = vehicleData[index];
    vehicleData.splice(index, 1);
    saveToLocalStorage();
    updateVehicleTable();
    logHistory("Veículo deletado", deletedVehicle.placa); 
}

function saveToLocalStorage() {
    localStorage.setItem('vehicleData', JSON.stringify(vehicleData));
}

function initializeMap(lat = -23.55052, lng = -46.633308) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.on('click', function (event) {
            const { lat, lng } = event.latlng;
            document.getElementById('latitude').value = lat.toFixed(6);
            document.getElementById('longitude').value = lng.toFixed(6);

            if (marker) {
                marker.setLatLng(event.latlng);
            } else {
                marker = L.marker(event.latlng).addTo(map);
            }
        });
    } else {
        map.setView([lat, lng], 13);
        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng]).addTo(map);
        }
    }
}

function resetMap() {
    if (marker) {
        map.removeLayer(marker);
        marker = null;
    }
    map.setView([-23.55052, -46.633308], 13); 
}

updateVehicleTable();
