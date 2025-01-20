
// Carregar o histórico do localStorage
const historyList = document.getElementById('historyList');
const history = JSON.parse(localStorage.getItem('vehicleHistory')) || [];

// Exibir o histórico
history.forEach(entry => {
    const listItem = document.createElement('li');
    listItem.textContent = entry;
    historyList.appendChild(listItem);
});

// Atualização em tempo real (opcional)
window.addEventListener('storage', () => {
    historyList.innerHTML = ''; // Limpar a lista
    const updatedHistory = JSON.parse(localStorage.getItem('vehicleHistory')) || [];
    updatedHistory.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = entry;
        historyList.appendChild(listItem);
    });
});
