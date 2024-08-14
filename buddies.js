// Hacemos una solicitud para obtener los datos de los buddies desde la API de Valorant
fetch("https://valorant-api.com/v1/buddies")
    .then(response => response.json()) // Convertimos la respuesta a JSON
    .then(data => {
        const buddies = data.data; // Guardamos la lista de buddies en una variable
        const container = document.getElementById('main-content'); // Seleccionamos el contenedor principal donde se mostrarán las tarjetas
        const searchInput = document.getElementById('searchInput'); // Seleccionamos el campo de búsqueda
        const viewFavoritesButton = document.getElementById('view-favorites'); // Seleccionamos el botón para ver favoritos
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]'); // Obtenemos la lista de favoritos desde el localStorage o una lista vacía si no existen
        let isViewingFavorites = false; // Variable para controlar si se están viendo solo los favoritos

        // Función para mostrar los buddies en el contenedor
        function displayBuddies(filteredBuddies) {
            container.innerHTML = ''; // Limpiamos el contenedor antes de añadir nuevos elementos
            const cardCount = document.getElementById('card-count'); // Seleccionamos el elemento donde se mostrará el conteo de tarjetas

            // Si no hay buddies filtrados, mostramos un mensaje de "No se encontraron tarjetas"
            if (filteredBuddies.length === 0) {
                const noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results';
                noResultsMessage.innerText = 'No se encontraron tarjetas';
                container.appendChild(noResultsMessage);
                cardCount.innerText = 'Total de tarjetas: 0';
            } else {
                // Si hay buddies filtrados, los mostramos como tarjetas
                filteredBuddies.forEach(buddy => {
                    const isFavorite = favorites.includes(buddy.uuid); // Verificamos si el buddy es un favorito
                    const card = document.createElement('div');
                    card.className = 'col';
                    card.innerHTML = `
                        <div class="card h-100">
                            <img src="${buddy.displayIcon}" class="card-img-top" alt="${buddy.displayName}" loading="lazy">
                            <div class="card-body">
                                <h5 class="card-title">${buddy.displayName}</h5>
                                <button class="btn btn-outline-warning btn-favorite" data-id="${buddy.uuid}">
                                    <i class="fas fa-star${isFavorite ? '' : '-o'}"></i> Favorito
                                </button>
                            </div>
                        </div>
                    `;
                    container.appendChild(card); // Añadimos la tarjeta al contenedor
                });
                cardCount.innerText = `Total de tarjetas: ${filteredBuddies.length}`; // Actualizamos el conteo de tarjetas
            }

            // Añadimos un event listener a cada botón de favorito para gestionar las acciones de añadir o quitar favoritos
            document.querySelectorAll('.btn-favorite').forEach(button => {
                button.addEventListener('click', (e) => {
                    const buddyId = e.currentTarget.getAttribute('data-id'); // Obtenemos el ID del buddy asociado al botón
                    const starIcon = e.currentTarget.querySelector('i'); // Seleccionamos el ícono de estrella dentro del botón
                    const isFavorite = favorites.includes(buddyId); // Verificamos si el buddy ya está en favoritos

                    if (isFavorite) {
                        // Si ya es favorito, lo quitamos de la lista de favoritos
                        const index = favorites.indexOf(buddyId);
                        if (index > -1) {
                            favorites.splice(index, 1); // Eliminamos el buddy de la lista de favoritos
                        }
                        starIcon.classList.remove('fa-star'); // Cambiamos el ícono a una estrella vacía
                        starIcon.classList.add('fa-star-o');
                    } else {
                        // Si no es favorito, lo añadimos a la lista de favoritos
                        favorites.push(buddyId);
                        starIcon.classList.remove('fa-star-o'); // Cambiamos el ícono a una estrella llena
                        starIcon.classList.add('fa-star');
                    }

                    // Guardamos la lista de favoritos actualizada en el localStorage
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                });
            });
        }

        // Función para filtrar los buddies según el término de búsqueda y si se están viendo solo favoritos
        function filterBuddies() {
            const searchTerm = searchInput.value.toLowerCase(); // Obtenemos el término de búsqueda en minúsculas
            const filteredBuddies = (isViewingFavorites 
                ? buddies.filter(buddy => favorites.includes(buddy.uuid)) // Filtramos solo los favoritos si está activo
                : buddies
            ).filter(buddy => buddy.displayName.toLowerCase().includes(searchTerm)); // Filtramos por nombre de buddy que coincida con el término de búsqueda
            displayBuddies(filteredBuddies); // Mostramos los buddies filtrados
        }

        // Añadimos un event listener al campo de búsqueda para filtrar los buddies a medida que el usuario escribe
        searchInput.addEventListener('input', filterBuddies);

        // Añadimos un event listener al botón de ver favoritos para alternar entre ver todos los buddies o solo los favoritos
        viewFavoritesButton.addEventListener('click', () => {
            isViewingFavorites = !isViewingFavorites; // Cambiamos el estado de visualización de favoritos
            if (isViewingFavorites) {
                viewFavoritesButton.innerText = 'Ver Todos'; // Cambiamos el texto del botón
            } else {
                viewFavoritesButton.innerText = 'Ver Favoritos';
            }
            filterBuddies(); // Aplicamos el filtro cuando se cambia el estado de favoritos
        });

        // Mostramos todos los buddies inicialmente cuando se carga la página
        filterBuddies();
    });
