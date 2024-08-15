fetch("https://valorant-api.com/v1/buddies")
    .then(response => response.json())
    .then(data => {
        const buddies = data.data;
        const container = document.getElementById('main-content');
        const searchInput = document.getElementById('searchInput');
        const viewFavoritesButton = document.getElementById('view-favorites');
        const favoritesContainer = document.getElementById('favorites-container');
        const favoritesModal = new bootstrap.Modal(document.getElementById('favoritesModal'));
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        function displayBuddies(filteredBuddies) {
            container.innerHTML = '';
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

            addFavoriteButtonListeners();
        }

        function displayFavorites() {
            favoritesContainer.innerHTML = '';
            const favoriteBuddies = buddies.filter(buddy => favorites.includes(buddy.uuid));

            if (favoriteBuddies.length === 0) {
                const noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-resultsFav';
                noResultsMessage.innerHTML = `
                    <p>No hay tarjetas que mostrar</p>
                    <img src="./img/logoMensajeNoResultado.jpg" alt="Buddy tachado" class="img-fluid" style="max-width: 200px; display: block; margin: 0 auto;">
                `;
                favoritesContainer.appendChild(noResultsMessage);
            } else {
                favoriteBuddies.forEach(buddy => {
                    const card = document.createElement('div');
                    card.className = 'col';
                    card.innerHTML = `
                        <div class="card h-100">
                            <img src="${buddy.displayIcon}" class="card-img-top" alt="${buddy.displayName}" loading="lazy">
                            <div class="card-body">
                                <h5 class="card-title">${buddy.displayName}</h5>
                                <button class="btn btn-outline-warning btn-favorite" data-id="${buddy.uuid}">
                                    <i class="fas fa-star"></i> Favorito
                                </button>
                            </div>
                        </div>
                    `;
                    favoritesContainer.appendChild(card);
                });

                addFavoriteButtonListeners(true);
            }
        }

        function addFavoriteButtonListeners(isModal = false) {
            document.querySelectorAll('.btn-favorite').forEach(button => {
                button.addEventListener('click', (e) => {
                    const buddyId = e.currentTarget.getAttribute('data-id');
                    const starIcon = e.currentTarget.querySelector('i');
                    const isFavorite = favorites.includes(buddyId);

                    if (isFavorite) {
                        const index = favorites.indexOf(buddyId);
                        if (index > -1) {
                            favorites.splice(index, 1);
                        }
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                        starIcon.classList.remove('fa-star');
                        starIcon.classList.add('fa-star-o');
                        
                        if (isModal) {
                            e.currentTarget.closest('.col').remove();
                            if (favorites.length === 0) {
                                const noResultsMessage = document.createElement('div');
                                noResultsMessage.className = 'no-resultsFav';
                                noResultsMessage.innerHTML = `
                                    <p>No hay tarjetas que mostrar</p>
                                    <img src="./img/logoMensajeNoResultado.jpg" alt="Buddy tachado" class="img-fluid" style="max-width: 200px; display: block; margin: 0 auto;">
                                `;
                                favoritesContainer.appendChild(noResultsMessage);
                            }
                        }
                    } else {
                        favorites.push(buddyId);
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                        starIcon.classList.remove('fa-star-o');
                        starIcon.classList.add('fa-star');
                    }

                    if (!isModal) {
                        displayBuddies(buddies.filter(buddy => buddy.displayName.toLowerCase().includes(searchInput.value.toLowerCase())));
                    }
                });
            });
        }

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredBuddies = buddies.filter(buddy =>
                buddy.displayName.toLowerCase().includes(searchTerm)
            );
            displayBuddies(filteredBuddies);
        });

        viewFavoritesButton.addEventListener('click', () => {
            displayFavorites();
            favoritesModal.show();
        });

        document.getElementById('favoritesModal').addEventListener('hidden.bs.modal', () => {
            displayBuddies(buddies.filter(buddy => buddy.displayName.toLowerCase().includes(searchInput.value.toLowerCase())));
        });

        displayBuddies(buddies);
    });