let series = [];

function checkUserCredentials () {
  const isUserLogged = localStorage.getItem('loggedUserId')

  if (!isUserLogged && window.location.pathname !== '/pages/login.html') {
    window.location.pathname = '/pages/login.html'
  }

  if (isUserLogged && window.location.pathname === '/pages/login.html') {
    window.location.pathname = '/index.html'
  }
}

function logout() {
  localStorage.removeItem('loggedUserId')

  const didConfirm = confirm('You are going to be logged out')

  if (didConfirm) {
    window.location.pathname = '/pages/login.html'
  }
}

function fillPreviuosValues() {
  const savedFormValues = localStorage.getItem('formValues')

  if (savedFormValues) {
    const objectFormValues = JSON.parse(savedFormValues)
   
    document.querySelector("#serie-title").value = objectFormValues.serieTitle
    document.querySelector("#serie-genre").value = objectFormValues.serieGenre
    document.querySelector('#serie-seasons').value = objectFormValues.serieSeasons
    document.querySelector('#serie-release-year').value = objectFormValues.serieReleaseYear
    document.querySelector('#serie-synopsis').value = objectFormValues.serieSynopsis
  }
}

function saveFilledValues() {
  const serieTitle = document.querySelector("#serie-title").value;
  const serieGenre = document.querySelector('#serie-genre').value;
  const serieSeasons = document.querySelector('#serie-seasons').value;
  const serieReleaseYear = document.querySelector('#serie-release-year').value;
  const serieSynopsis = document.querySelector('#serie-synopsis').value;

  const formValues = {
    serieTitle,
    serieGenre,
    serieSeasons,
    serieReleaseYear,
    serieSynopsis,
  }

  const stringFormValues = JSON.stringify(formValues)
  localStorage.setItem('formValues', stringFormValues)
}

function toggleContent() {
  const flipContainer = document.querySelector('.flip-container');
  const checkBox = document.getElementById("check");

  const setSerie = document.getElementById("serie-title-toggle");
  const setMovie = document.getElementById("movie-title-toggle");

  if (checkBox.checked) {
    flipContainer.classList.add('flip');
    document.getElementById("movie-form").style.display = "flex";
    document.getElementById("serie-form").style.display = "none";

    setSerie.classList.remove('serie-active');
    setMovie.classList.add('movie-active');
  } else {
    flipContainer.classList.remove('flip');
    document.getElementById("movie-form").style.display = "none";
    document.getElementById("serie-form").style.display = "flex";

    setSerie.classList.add('serie-active');
    setMovie.classList.remove('movie-active');
  }
} 

function setInitialState() {
  const checkBox = document.getElementById("check");
  checkBox.checked = false;

  toggleContent(); 
}

function create() {
  const serieTitle = document.querySelector("#serie-title");
  const serieGenre = document.querySelector('#serie-genre');
  const serieSeasons = document.querySelector('#serie-seasons');
  const serieReleaseYear = document.querySelector('#serie-release-year');
  const serieSynopsis = document.querySelector('#serie-synopsis');
  
  if (
    serieTitle.value === "" 
    || serieGenre.value === "" 
    || serieSeasons.value === "" 
    || serieReleaseYear.value === "" 
    || serieSynopsis.value === ""
  ) {
    return alert("All informations needs to be filled!")
  } 

  const ownerId = localStorage.getItem('loggedUserId')

  disableButton()

  axios.post('https://api.flickshelf.com/series', {
      ownerId,
      serieTitle: serieTitle.value,
      serieGenre: serieGenre.value,
      serieSeasons: serieSeasons.value,
      serieReleaseYear: serieReleaseYear.value,
      serieSynopsis: serieSynopsis.value,
    })
    .then(() => {
      alert(`Serie ${serieTitle.value} created successfully!`)
      localStorage.removeItem('formValues')

      serieTitle.value = ''
      serieGenre.value = ''
      serieSeasons.value = ''
      serieReleaseYear.value = ''
      serieSynopsis.value = ''
    })
    .catch(() => {
      alert('There was an error. Try again.');
    })
    .finally(() => {
      enableButton()
    })
}

function disableButton () {
  const createButton = document.querySelector('.create-btn') 

  createButton.setAttribute('disabled', '')
  createButton.style.backgroundColor = 'grey'
  createButton.style.cursor = 'not-allowed'
  createButton.style.color = 'white'

  createButton.innerHTML = `<img src="png/white-button-spinner.gif" class="button-loader">`
}

function enableButton() {
  const createButton = document.querySelector('.create-btn') 

  createButton.removeAttribute('disabled')
  createButton.style.backgroundColor = '#0866ff'
  createButton.style.cursor = 'pointer'
  createButton.style.color = 'white'
  createButton.innerText = 'Create'
}

function openListSeriesPage() {
  window.location.pathname = '/pages/list-series.html'
}

function openRegisterPage() {
  window.location.pathname = '/index.html'
}

function listSeries() {
  const ownerId = localStorage.getItem('loggedUserId')
  const listContainer = document.getElementById('list-series-container')
  const emptyState = document.getElementById('empty-state-container')

  console.log(ownerId)

  listContainer.innerHTML = ''
  emptyState.classList.add('hidden')
  showLoadingSpinner()

  axios.get(`https://api.flickshelf.com/${ownerId}/series`)
    .then(response => {
      series = response.data;

      if (series.length === 0) {
        emptyState.classList.remove('hidden')
      } else {
        emptyState.classList.add('hidden')
        series.forEach(serie => {
          createSerieElement(serie, listContainer)
        });
      }
    })
    .catch(error => {
      console.error('Error searching series:', error);
      alert('There was an error while searching series. Try again.')
    })
    .finally(() => {
      hideLoadingSpinner()
    });
}

function clearCardContent(id) {
  const card = $(`#${CSS.escape(id)}`)
  card.empty()
}

function showLoadingSpinner(params = {}) {
  const { type, id } = params

  if (type === 'card') {
    const card = document.querySelector(`#${CSS.escape(id)}`)
    card.setAttribute('class', 'serie-item loading')

    const loadingSpinnerGif = document.createElement('img')
    loadingSpinnerGif.setAttribute('class', 'loading-spinner card')
    loadingSpinnerGif.setAttribute('src', '/png/spinner.gif')

    clearCardContent(id)
    return card.appendChild(loadingSpinnerGif)
  }

  const body = document.querySelector('body')
  
  const emptyStateDiv = document.createElement('div')
  emptyStateDiv.setAttribute('class', 'empty-state')
  body.appendChild(emptyStateDiv)

  const loadingSpinnerGif = document.createElement('img')
  loadingSpinnerGif.setAttribute('class', 'loading-spinner')
  loadingSpinnerGif.setAttribute('src', '/png/spinner.gif')

  emptyStateDiv.appendChild(loadingSpinnerGif)
}

function hideLoadingSpinner(params = {}) {
  const { type } = params

  const body = type === 'card' 
    ? document.querySelector('.serie-item.loading')
    : document.querySelector('body')

  const emptyStateDiv = type === 'card' 
    ? document.querySelector('.loading-spinner.card')
    : document.querySelector('.empty-state')

  if (emptyStateDiv) {
    body.removeChild(emptyStateDiv)
  }
}

function createSerieElement(serie, listSeriesContainer) {
  const card = document.createElement('div')
  card.setAttribute('class', 'serie-item')
  card.setAttribute('id', `${serie.id}`)

  const cardTitle = document.createElement('h3')
  cardTitle.setAttribute('class', 'serie-title')
  cardTitle.innerHTML = serie.title
  card.appendChild(cardTitle)

  const cardGenre = document.createElement('p')
  cardGenre.innerHTML = `<b>Genre:</b> ${handleSerieGenre(serie.genre)}`
  card.appendChild(cardGenre)

  const cardSeasons = document.createElement('p')
  cardSeasons.innerHTML = `<b>Seasons:</b> ${serie.seasons}`
  card.appendChild(cardSeasons)

  const cardReleaseYear = document.createElement('p')
  cardReleaseYear.innerHTML = `<b>Release year:</b> ${serie.release_year}`
  card.appendChild(cardReleaseYear)

  const synopsisDiv = document.createElement('div')
  synopsisDiv.setAttribute('class', 'synopsis-div')
  card.appendChild(synopsisDiv)

  const cardSynopsis = document.createElement('p')
  cardSynopsis.innerHTML = `<b>Synopsis:</b> ${serie.synopsis}`
  synopsisDiv.appendChild(cardSynopsis)

  const cardButtons = document.createElement('div')
  cardButtons.setAttribute('class', 'card-buttons')
  card.appendChild(cardButtons)

  const updateIcon = document.createElement('ion-icon')
  updateIcon.setAttribute('name', 'create-outline')
  updateIcon.setAttribute('onclick', `handleEditClick('${serie.id}')`)
  cardButtons.appendChild(updateIcon)

  const trashIcon = document.createElement('ion-icon')
  trashIcon.setAttribute('name', 'trash')
  trashIcon.setAttribute('onclick', `handleTrashClick('${serie.id}')`)
  cardButtons.appendChild(trashIcon)

  listSeriesContainer.appendChild(card)
}

function handleEditClick(id) {
  const listSeriesContainer = $('#list-series-container');
  listSeriesContainer.empty();
  showEditSerieModal(id);
}

function closeEditSerieModal() {
  const editModal = $('.edit-serie-modal')

  editModal.remove()

  const listSeriesContainer = $('#list-series-container');
  listSeriesContainer.empty();
  
  listSeries()
}

function showEditSerieModal(id) {
  const body = $('body')

  const editModal = document.createElement('div')
  editModal.setAttribute('class', 'edit-serie-modal')

  const closeButton = document.createElement('ion-icon')
  closeButton.setAttribute('name', 'close-outline')
  closeButton.setAttribute('class', 'edit-modal-close-button')
  closeButton.setAttribute('onclick', 'closeEditSerieModal()')
  editModal.append(closeButton)

  const iframe = document.createElement('iframe')

  const host = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5500' 
    : 'https://flickshelf.com'
  iframe.setAttribute('src', `${host}/pages/update-serie.html`)

  iframe.setAttribute('name', id)
  editModal.append(iframe)

  body.append(editModal)
}

function handleSerieGenre(genre) {
  let genreToDisplay = ''

  switch (genre) {
    case 'comedy':
      genreToDisplay = 'Comedy'
      break;
    case 'sitcom':
      genreToDisplay = 'Sitcom'
      break;
    case 'scifi':
      genreToDisplay = 'Sci/Fi'
      break;
    case 'horror':
      genreToDisplay = 'Horror'
      break;
    case 'drama':
      genreToDisplay = 'Drama'
      break;
    default:
      genreToDisplay = '-'
      break;
  }
  
  return genreToDisplay
}

function handleTrashClick(id) {
  const hasConfirm = confirm('Are you sure you want to delete?')

  if (hasConfirm) {
    showLoadingSpinner({ type: 'card', id })

    axios.delete(`https://api.flickshelf.com/serie/${id}`)
      .then(() => {
        series.pop()
        removeSerieCard(id)

        if (series.length === 0) {
          document.getElementById('empty-state-container').classList.remove('hidden')
          hideLoadingSpinner()
        } else {
          document.getElementById('empty-state-container').classList.add('hidden')
        }
      })
      .catch(errorDeleteSerie)
      .finally(() => {
        hideLoadingSpinner({ type: 'card' })
      })
  }
}

function removeSerieCard(id) {
  const serieCard = $(`#${CSS.escape(id)}`);
  serieCard.remove();
}

function reloadSerieList() {
  const listSeriesContainer = $('#list-series-container');
  listSeriesContainer.empty();

  alert('Serie deleted successfully!')
  
  listSeries()
}

function errorDeleteSerie() {
  alert('There was an error while getting series. Try again.')
}
