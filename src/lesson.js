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

  for (let l = 0; l < Lessons.length; l++) {
    const element = Lessons[l];

    const result = element["lessonid"] == id.value
    console.log(result);

    if (result === true) {
      const updatedLesson = element;

      try {
        // make an update call to the smart contract
        await window.contract.addAttendance({
          // pass the value that the user entered in the lesson field
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

  // update the greeting in the UI
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

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  fetchLessons()
}

// update global currentLesson variable; update DOM with it
async function fetchLessons() {
  currentLesson = await contract.getLessons()
  document.querySelectorAll('[data-behavior="card"]').forEach(el => {
    // set divs, spans, etc
    // el.innerText = currentLesson
    for (var i = 0; i < currentLesson.length; i++) {
      // append each lesson to our page
      const cardHTML = `
      <div class="card-body">
      <h5 class="card-title" id="lessonname" value=${currentLesson[i].lessonname}>Lesson Name: ${currentLesson[i].lessonname}</h5>
      <p class="card-text" id="sender" value=${currentLesson[i].sender}>${currentLesson[i].sender}</p>
      <p class="card-text" id="loggedminutes" value=${currentLesson[i].lessontime}>${currentLesson[i].lessontime}</p>
      <p class="card-text" id="schoolname" value=${currentLesson[i].school}>${currentLesson[i].school}</p>
      <p class="card-text" id="lessonid" value=${currentLesson[i].lessonid}>${currentLesson[i].lessonid}</p>
      <button type="submit" class="btn btn-primary">View Lesson</button>
      </div>`

      el.innerHTML += cardHTML
    }
    console.log(currentLesson);

    // set input elements
    // el.value = currentLesson
  })
  // $(document).ready(function () {
  //   $.getJSON(currentLesson, function( data ) {
  //     var items = [];
  //     console.log(data);
  //     $.each( data, function( key, val ) {
  //       // items.push( "<li id='" + key + "'>" + val + "</li>" );
  //       $("div").append(data + "");
  //     });
     
  //     // $( "<ul/>", {
  //     //   "class": "my-new-list",
  //     //   html: items.join( "" )
  //     // }).appendTo( "body" );
  //   });
  // })

  // var Lesson = [{"premium":"false","sender":"allanm.testnet","lessonid":"3","lessonname":"tox"},{"premium":"false","sender":"allanm.testnet","lessonid":"5","lessonname":"AssemblyScript"},{"premium":"false","sender":"allanm.testnet","lessonid":"6","lessonname":"NEAR"},{"premium":"false","sender":"allanm.testnet","lessonid":"2","lessonname":"Tion"},{"premium":"false","sender":"allanm.testnet","lessonid":"9","lessonname":"Blama"},{"premium":"false","sender":"allanm.testnet","lessonid":"1","lessonname":"Wayne"},{"premium":"false","sender":"allanm.testnet","lessonid":"0","lessonname":"Aurora"},{"premium":"false","sender":"allanm.testnet","lessonid":"7","lessonname":"Rainbow"},{"premium":"false","sender":"allanm.testnet","lessonid":"4","lessonname":"Rust"},{"premium":"false","sender":"allanm.testnet","lessonid":"8","lessonname":"Yocta"}]

  // $(document).ready( function() {
  //   $.noConflict();
  //   $("#table1").DataTable({
  //     data: currentLesson,
  //     columns: [
  //       { title: "Premium" },
  //       { title: "Sender" },
  //       { title: "Lesson Id" },
  //       { title: "Lesson Name" }
  //   ]
  //   });
    // let tr = $("<tr />");
  
    // $.each(currentLesson, function(_, obj) {
    //   tr = $("<tr />");
    //   $.each(obj, function(_, text) {
    //     tr.append("<td>" + text + "</td>")
    //   });
    //   tr.appendTo(tbody);
    // });
  // })
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)