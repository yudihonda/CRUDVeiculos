
const historyList = document.getElementById('historyList');
const history = JSON.parse(localStorage.getItem('vehicleHistory')) || [];

history.forEach(entry => {
    const listItem = document.createElement('li');
    listItem.textContent = entry;
    historyList.appendChild(listItem);
});

window.addEventListener('storage', () => {
    historyList.innerHTML = ''; 
    const updatedHistory = JSON.parse(localStorage.getItem('vehicleHistory')) || [];
    updatedHistory.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = entry;
        historyList.appendChild(listItem);
    });
});
