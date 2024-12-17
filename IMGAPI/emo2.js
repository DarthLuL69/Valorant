document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "index.html") {
        cargarDatosValorant('agents', 'valorant-logos', 'valorant');
    } else if (currentPage === "maps.html") {
        cargarDatosValorant('maps', 'maps-valorant', 'mapas');
    }

    initializeThemeToggle();
});

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (!themeToggle || !themeIcon) return;

    const setDarkMode = () => {
        document.documentElement.classList.add('dark');
        document.body.classList.add('bg-gray-800', 'text-gray-100');
        document.body.classList.remove('bg-white', 'text-black');
        document.querySelectorAll('.bg-gray-900').forEach(el => el.classList.replace('bg-gray-900', 'bg-black'));
        document.querySelectorAll('.bg-gray-800').forEach(el => el.classList.replace('bg-gray-800', 'bg-black'));
        document.querySelectorAll('th, td').forEach(el => el.classList.replace('text-gray-800', 'text-gray-100'));
        themeIcon.src = 'Sol.png';
    };

    const setLightMode = () => {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('bg-white', 'text-black');
        document.body.classList.remove('bg-gray-800', 'text-gray-100');
        document.querySelectorAll('.bg-black').forEach(el => el.classList.replace('bg-black', 'bg-gray-900'));
        document.querySelectorAll('.bg-black').forEach(el => el.classList.replace('bg-black', 'bg-gray-700'));
        document.querySelectorAll('th, td').forEach(el => el.classList.replace('text-gray-100', 'text-gray-800'));
        themeIcon.src = 'Luna.png';
    };

    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'light');
            setLightMode();
        } else {
            localStorage.setItem('theme', 'dark');
            setDarkMode();
        }
    });

    if (localStorage.getItem('theme') === 'dark') {
        setDarkMode();
    } else {
        setLightMode();
    }
}

function cargarDatosValorant(endpoint, idContenedor, categoria) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) {
        console.error(`Container with id ${idContenedor} not found`);
        return;
    }

    fetch(`https://valorant-api.com/v1/${endpoint}`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            datos.data.forEach(item => {
                const row = document.createElement('tr');
                const iconCell = document.createElement('td');
                const nameCell = document.createElement('td');

                const boton = document.createElement('button');
                boton.onclick = (event) => handleButtonClick(event, item, categoria);

                const img = document.createElement('img');
                img.src = item.displayIcon;
                img.alt = item.displayName;
                img.className = 'w-32 h-32';

                boton.appendChild(img);
                iconCell.appendChild(boton);
                nameCell.className = 'py-4 px-6';
                nameCell.textContent = item.displayName;

                row.appendChild(iconCell);
                row.appendChild(nameCell);
                contenedor.appendChild(row);
            });
        });
}

function handleButtonClick(event, item, categoria) {
    if (categoria === 'valorant') {
        const abilities = item.abilities ? item.abilities.map(a => a.displayName).join(',') : '';
        const role = item.role ? {
            icon: item.role.displayIcon,
            name: item.role.displayName,
            description: item.role.description
        } : {};
        window.location.href = `individual.html?icon=${item.displayIcon}&description=${item.description || item.displayName}&abilities=${abilities}&roleIcon=${role.icon}&roleName=${role.name}&roleDescription=${role.description}`;
    } else {
        mostrarMapa(event, item.displayIcon, item.displayName, item.coordinates || 'No coordinates available');
    }
}

function mostrarMapa(event, icon, name, coordinates) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-transform transform';
    modal.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(0)`;
    modal.innerHTML = `
        <div class="bg-black bg-opacity-50 rounded-lg shadow-lg p-8 max-w-lg w-full transition-transform transform">
            <img src="${icon}" alt="${name}" class="w-full h-48 object-cover mb-4">
            <h2 class="text-xl font-bold mb-2 text-white">${name}</h2>
            <p class="mb-4 text-white">Coordenadas: ${coordinates}</p>
            <div class="flex justify-center">
                <button class="bg-red-500 text-white px-4 py-2 text-lg" style="border-radius: 0;" onclick="this.parentElement.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.transform = 'translate(0, 0) scale(1)';
    }, 10);
}

function mostrarEmoji(categoria, src, descripcion, abilities, role) {
    const descripcionDisplay = document.getElementById(`${categoria}-description`);
    const abilitiesDisplay = document.getElementById(`${categoria}-abilities`);
    const abilitiesList = document.getElementById('abilities-list');
    const roleDisplay = document.getElementById(`${categoria}-role`);
    const roleIcon = document.getElementById('role-icon');
    const roleName = document.getElementById('role-name');
    const roleDescription = document.getElementById('role-description');

    if (!descripcionDisplay || !abilitiesDisplay || !abilitiesList || !roleDisplay || !roleIcon || !roleName || !roleDescription) {
        console.error(`Display elements for category ${categoria} not found`);
        return;
    }

    descripcionDisplay.textContent = descripcion;
    descripcionDisplay.classList.remove('hidden');

    if (role) {
        roleIcon.src = role.icon;
        roleName.textContent = role.name;
        roleDescription.textContent = role.description;
        roleDisplay.classList.remove('hidden');
    } else {
        roleDisplay.classList.add('hidden');
    }

    if (abilities && abilities.length > 0) {
        abilitiesList.innerHTML = '';
        abilities.forEach(ability => {
            const li = document.createElement('li');
            li.textContent = ability;
            abilitiesList.appendChild(li);
        });
        abilitiesDisplay.classList.remove('hidden');
    } else {
        abilitiesDisplay.classList.add('hidden');
    }

    animateBackgroundImage();
}

function animateBackgroundImage() {
    const backgroundImage = document.getElementById('background-image');
    if (!backgroundImage) return;

    backgroundImage.classList.add('animate-back-and-forth');
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const icon = urlParams.get('icon');
    const description = urlParams.get('description');
    const abilities = urlParams.get('abilities') ? urlParams.get('abilities').split(',') : [];
    const role = {
        icon: urlParams.get('roleIcon'),
        name: urlParams.get('roleName'),
        description: urlParams.get('roleDescription')
    };

    if (icon && description) {
        mostrarEmoji('individual', icon, description, abilities, role);
        document.getElementById('background-image').style.backgroundImage = `url(${icon})`;
    }
});