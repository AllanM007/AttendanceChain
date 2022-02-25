import 'regenerator-runtime/runtime'

import { initContract } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

// global variable used throughout
// let currentGreeting
let currentLesson

const submitButton = document.querySelector('form button')

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  fetchLessons()
}

// update global currentLesson variable; update DOM with it
async function fetchLessons() {
  currentLesson = await contract.getLessons()
  document.querySelectorAll('[data-behavior="lessons"]').forEach(el => {
    // set divs, spans, etc
    el.innerText = currentLesson
    for (var i = 0; i < currentLesson.length; i++) {
      // append each lesson to our page
      const cardHTML = `<div class="row">
      <div class="col-sm-6">
      <div class="card-body">
      <h5 class="card-title">Lesson Name: ${currentLesson[i].lessonname}</h5>
      <p class="card-text">${currentLesson[i].sender}</p>
      <a href="/attendance.html/${currentLesson[i].lessonid}" class="btn btn-primary">View Lesson</a>
      </div></div>
      </div>`
      
      el.innerHTML += cardHTML
    }
    console.log(currentLesson);
  })
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)