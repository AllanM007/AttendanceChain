import 'regenerator-runtime/runtime'

import { initContract } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

// global variable used throughout
let currentLesson

const submitButton = document.querySelector('form button')

document.querySelector('form').onsubmit = async (event) => {
  event.preventDefault()

  // get elements from the form using their id attribute
  const { fieldset, id } = event.target.elements

  // disable the form while the value gets updated on-chain
  fieldset.disabled = true
  
  console.log(id.value);

  var Lessons = await contract.getLessons();

  // loop through lessons array to check if lesson id entered by user is in present
  for (let l = 0; l < Lessons.length; l++) {
    const element = Lessons[l];

    const result = element["lessonid"] == id.value

    if (result === true) {
      const updatedLesson = element;

      try {
        // make an update call to the smart contract
        await window.contract.addAttendance({
          // pass the value that the user entered in the attendance field
          studentid: updatedLesson.sender,
          studentname: updatedLesson.sender,
          schoolname: updatedLesson.school,
          loggedminutes: updatedLesson.lessontime,
          lessonid: updatedLesson.lessonid,
          subject: updatedLesson.lessonname,
          attended: true
        })
      } catch (e) {
        alert(
          'Something went wrong! ' +
          'Maybe you need to sign out and back in? ' +
          'Check your browser console for more info.'
        )
        throw e
      } finally {
        // re-enable the form, whether the call succeeded or failed
        fieldset.disabled = false
      }
    } else {
      console.log("lesson not found");
    }
  }

  // update the lesson in the UI
  await fetchLesson()

  // show notification
  document.querySelector('[data-behavior=notification]').style.display = 'block'

  // remove notification again after css animation completes
  // this allows it to be shown again next time the form is submitted
  setTimeout(() => {
    document.querySelector('[data-behavior=notification]').style.display = 'none'
  }, 11000)
}

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {

  document.getElementById("url").href = `https://explorer.testnet.near.org/accounts/${window.accountId}`;

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  fetchLessons()
}

// update global currentLesson variable; update DOM with it
async function fetchLessons() {
  
  // call contract to fetch lessons
  currentLesson = await contract.getLessons()
  document.querySelectorAll('[data-behavior="card"]').forEach(el => {
    // set divs, spans, etc
    // el.innerText = currentLesson
    for (var i = 0; i < currentLesson.length; i++) {
      // append each lesson to our card
      const cardHTML = `
      <div class="row">
      <div class="md-6">
      <div class="card-body">
      <h7 class="card-title">Lesson Name: ${currentLesson[i].lessonname}</h7>
      <p class="card-text">Tutor: ${currentLesson[i].sender}</p>
      <p class="card-text">Duration: ${currentLesson[i].lessontime} minutes</p>
      <p class="card-text">School: ${currentLesson[i].school}</p>
      <button class="btn btn-primary">ID: ${currentLesson[i].lessonid}</button>
      <hr>
      </div>
      </div>
      </div>`

      el.innerHTML += cardHTML
    }
    console.log(currentLesson);

    // set input elements
    // el.value = currentLesson
  })
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)