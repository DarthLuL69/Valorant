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
    const backgroundImage = document.getElementById('background-image');

    if (!themeToggle || !themeIcon || !backgroundImage) return;

    const setDarkMode = () => {
        document.documentElement.classList.add('dark');
        document.body.classList.replace('bg-white', 'bg-black');
        document.body.classList.replace('text-black', 'text-white');
        themeIcon.src = 'Sol.png';
        backgroundImage.classList.add('dark:bg-black', 'dark:bg-opacity-70');
        backgroundImage.style.backgroundImage = "url('FondoMain.jpg')";
    };

    const setLightMode = () => {
        document.documentElement.classList.remove('dark');
        document.body.classList.replace('bg-black', 'bg-white');
        document.body.classList.replace('text-white', 'text-black');
        themeIcon.src = 'Luna.png';
        backgroundImage.classList.remove('dark:bg-black', 'dark:bg-opacity-70');
        backgroundImage.style.backgroundImage = "url('FondoLuz.jpg')";
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
            if (categoria === 'valorant') {
                localStorage.setItem('agents', JSON.stringify(datos.data));
            }
            datos.data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'flex flex-col items-center';

                const boton = document.createElement('button');
                boton.onclick = (event) => handleButtonClick(event, item, categoria);

                const img = document.createElement('img');
                img.src = categoria === 'valorant' ? item.fullPortrait : item.displayIcon; 
                img.alt = item.displayName;
                img.className = 'w-full h-auto transform transition-transform duration-300 hover:scale-110';
                img.loading = 'lazy'; // Lazy loading

                const name = document.createElement('p');
                name.className = 'mt-2 text-center text-white';
                name.textContent = item.displayName;

                boton.appendChild(img);
                card.appendChild(boton);
                card.appendChild(name);
                contenedor.appendChild(card);
            });
        });
}

function handleButtonClick(event, item, categoria) {
    if (categoria === 'valorant') {
        const abilities = item.abilities ? item.abilities.map(a => ({
            displayName: a.displayName,
            displayIcon: a.displayIcon,
            description: a.description
        })) : [];
        const role = item.role ? {
            icon: item.role.displayIcon,
            name: item.role.displayName,
            description: item.role.description
        } : {};
        const urlParams = new URLSearchParams();
        urlParams.append('icon', item.displayIcon);
        urlParams.append('description', item.description || item.displayName);
        abilities.forEach((ability, index) => {
            urlParams.append(`ability${index}`, ability.displayName);
            urlParams.append(`abilityIcon${index}`, ability.displayIcon);
            urlParams.append(`abilityDescription${index}`, ability.description);
        });
        urlParams.append('roleIcon', role.icon);
        urlParams.append('roleName', role.name);
        urlParams.append('roleDescription', role.description);
        window.location.href = `individual.html?${urlParams.toString()}`;
    } else {
        mostrarMapa(event, item.splash || item.displayIcon, item.displayName, item.coordinates || 'No coordinates available');
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
            li.className = 'flex items-center space-x-2 relative group';
            const img = document.createElement('img');
            img.src = ability.displayIcon;
            img.alt = ability.displayName;
            img.className = 'w-6 h-6 cursor-pointer transition-transform duration-300 group-hover:scale-150';
            img.loading = 'fast';
            const span = document.createElement('span');
            span.textContent = ability.displayName;
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute right-full mr-2 w-48 p-2 bg-black text-white text-sm rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100';
            tooltip.textContent = ability.description;
            li.appendChild(img);
            li.appendChild(span);
            li.appendChild(tooltip);
            abilitiesList.appendChild(li);
        });
        abilitiesDisplay.classList.remove('hidden');
    } else {
        abilitiesDisplay.classList.add('hidden');
    }

    animateBackgroundImage();
}

function mostrarHabilidad(event, icon, name, description) {
    const imgElement = event.target;
    const rect = imgElement.getBoundingClientRect();
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-transform transform';
    modal.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(0)`;
    modal.innerHTML = `
        <div class="bg-black bg-opacity-50 rounded-lg shadow-lg p-8 max-w-lg w-full transition-transform transform">
            <img src="${icon}" alt="${name}" class="w-full h-48 object-cover mb-4">
            <h2 class="text-xl font-bold mb-2 text-white">${name}</h2>
            <p class="mb-4 text-white">${description}</p>
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

function animateBackgroundImage() {
    const backgroundImage = document.getElementById('background-image');
    if (!backgroundImage) return;

    backgroundImage.classList.add('animate-back-and-forth');
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const icon = urlParams.get('icon');
    const description = urlParams.get('description');
    const abilities = [];
    for (let i = 0; urlParams.get(`ability${i}`); i++) {
        abilities.push({
            displayName: urlParams.get(`ability${i}`),
            displayIcon: urlParams.get(`abilityIcon${i}`),
            description: urlParams.get(`abilityDescription${i}`)
        });
    }
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