fetch("https://valorant-api.com/v1/buddies")
    .then(response => response.json())
    .then(data => {
        const buddies = data.data;
        const container = document.getElementById('main-content');
        const searchInput = document.getElementById('searchInput');
        const viewFavoritesButton = document.getElementById('view-favorites');
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let isViewingFavorites = false;

        function displayBuddies(filteredBuddies) {
            container.innerHTML = ''; // Limpia el contenedor antes de añadir nuevos elementos
            const cardCount = document.getElementById('card-count');

            if (filteredBuddies.length === 0) {
                const noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results';
                noResultsMessage.innerText = 'No se encontraron tarjetas';
                container.appendChild(noResultsMessage);
                cardCount.innerText = 'Total de tarjetas: 0';
            } else {
                filteredBuddies.forEach(buddy => {
                    const isFavorite = favorites.includes(buddy.uuid);
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
                    container.appendChild(card);
                });
                cardCount.innerText = `Total de tarjetas: ${filteredBuddies.length}`;
            }

            // Añade event listener para los botones de favorito
            document.querySelectorAll('.btn-favorite').forEach(button => {
                button.addEventListener('click', (e) => {
                    const buddyId = e.currentTarget.getAttribute('data-id');
                    const starIcon = e.currentTarget.querySelector('i');
                    const isFavorite = favorites.includes(buddyId);

                    if (isFavorite) {
                        // Eliminar de favoritos
                        const index = favorites.indexOf(buddyId);
                        if (index > -1) {
                            favorites.splice(index, 1);
                        }
                        starIcon.classList.remove('fa-star');
                        starIcon.classList.add('fa-star-o');
                    } else {
                        // Añadir a favoritos
                        favorites.push(buddyId);
                        starIcon.classList.remove('fa-star-o');
                        starIcon.classList.add('fa-star');
                    }

                    // Guardar favoritos en el localStorage
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                });
            });
        }

        function filterBuddies() {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredBuddies = (isViewingFavorites 
                ? buddies.filter(buddy => favorites.includes(buddy.uuid)) 
                : buddies
            ).filter(buddy => buddy.displayName.toLowerCase().includes(searchTerm));
            displayBuddies(filteredBuddies);
        }

        searchInput.addEventListener('input', filterBuddies);

        viewFavoritesButton.addEventListener('click', () => {
            isViewingFavorites = !isViewingFavorites;
            if (isViewingFavorites) {
                viewFavoritesButton.innerText = 'Ver Todos';
            } else {
                viewFavoritesButton.innerText = 'Ver Favoritos';
            }
            filterBuddies(); // Aplicar el filtro cuando se cambia el estado de favoritos
        });

        // Muestra todos los buddies inicialmente cuando se carga la página
        filterBuddies();
    });
