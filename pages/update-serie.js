const serieId = window.name 
let serieInfo = {}

const serieTitle = document.querySelector("#serie-title");
const serieGenre = document.querySelector('#serie-genre');
const serieSeasons = document.querySelector('#serie-seasons');
const serieReleaseYear = document.querySelector('#serie-release-year');
const serieSynopsis = document.querySelector('#serie-synopsis');

const serieUpdateForm = $('.serie-update-form');

const updateButton = document.createElement('button')
updateButton.setAttribute('class', 'update-btn')
updateButton.setAttribute('type', 'button')
updateButton.setAttribute('disabled', '')
updateButton.style.backgroundColor = 'grey'
updateButton.style.cursor = 'not-allowed'
updateButton.innerText = 'Update'

updateButton.setAttribute('onclick', `update('${serieId}')`)
serieUpdateForm.append(updateButton);

getSerieById(serieId)

function getSerieById(id) {
    axios.get(`https://api.flickshelf.com/series/${id}`)
      .then((serie) => {
        serieInfo = serie.data[0]
        fillUpdateForm(id, serie.data)
      })
      .catch(() => {
        alert('There was an error while getting content. Try again.')
      })
}

function fillUpdateForm(id, serieInfo) {
    const serieTitle = document.querySelector("#serie-title");
    const serieGenre = document.querySelector('#serie-genre');
    const serieSeasons = document.querySelector('#serie-seasons');
    const serieReleaseYear = document.querySelector('#serie-release-year');
    const serieSynopsis = document.querySelector('#serie-synopsis');

    serieTitle.value = serieInfo[0].title
    serieGenre.value = serieInfo[0].genre
    serieSeasons.value = serieInfo[0].seasons
    serieReleaseYear.value = serieInfo[0].release_year
    serieSynopsis.value = serieInfo[0].synopsis
}

function disableButton () {
  const updateButton = document.querySelector('.update-btn')

  updateButton.setAttribute('disabled', '')
  updateButton.style.backgroundColor = 'grey'
  updateButton.style.cursor = 'not-allowed'
  updateButton.style.border = 'none'
  updateButton.style.color = 'white'

  updateButton.innerHTML = `<img src="../png/white-button-spinner.gif" class="button-loader">`
}

function enableButton() {
  const createButton = document.querySelector('.update-btn') 

  createButton.removeAttribute('disabled')
  createButton.style.backgroundColor = '#0866ff'
  createButton.style.cursor = 'pointer'
  createButton.style.color = 'white'
  createButton.innerText = 'Update'
}

function update(id) {
    const serieTitle = document.querySelector("#serie-title").value;
    const serieGenre = document.querySelector('#serie-genre').value;
    const serieSeasons = document.querySelector('#serie-seasons').value;
    const serieReleaseYear = document.querySelector('#serie-release-year').value;
    const serieSynopsis = document.querySelector('#serie-synopsis').value;

    checkFormValues({ showAlertMessage: true })

    disableButton()

    axios.put(`https://api.flickshelf.com/serie/${id}`, {
      serieTitle,
      serieGenre,
      serieSeasons,
      serieReleaseYear,
      serieSynopsis,
    }).then(() => {
      alert(`Serie ${serieTitle} updated successfully!`)
      const environment = window.location.hostname

      if (environment === 'localhost') {
        return window.top.location.href = "http://localhost:5500/pages/list-series.html";
      } else {
        parent.location.reload()
      }
    }).catch(function () {
      alert('There was an error while updating. Try again.')
    })
    .finally(() => {
      enableButton()
    })
}

function checkFormValues({ showAlertMessage }) {
  if (
    serieInfo.title === serieTitle.value
    && serieInfo.genre === serieGenre.value
    && serieInfo.seasons === Number(serieSeasons.value)  
    && serieInfo.release_year === Number(serieReleaseYear.value)
    && serieInfo.synopsis === serieSynopsis.value
  ) {
    if (showAlertMessage) {
      alert("There is nothing to update. All values are unchanged.")
    }

    return false
  } 

  if (
    serieTitle.value === "" 
    || serieGenre.value === "" 
    || serieSeasons.value === "" 
    || serieReleaseYear.value === "" 
    || serieSynopsis.value === ""
  ) {
    alert("All informations needs to be filled!")
    return false
  } 

  return true
}

function handleCheckFormValues() {
  const shouldEnableButton = checkFormValues({ showAlertMessage: false })
  const updateButton = document.querySelector('.update-btn')
  
  if (shouldEnableButton) {
    updateButton.removeAttribute('disabled')
    updateButton.style.backgroundColor = '#0866ff'
    updateButton.style.cursor = 'pointer'
  } else{
    updateButton.setAttribute('disabled', '')
    updateButton.style.backgroundColor = 'grey'
    updateButton.style.cursor = 'not-allowed'
  }
}
