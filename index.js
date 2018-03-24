/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')
require('./es6/myEs6code')
// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

function connectCallback() {
     client.subscribe("/fx/prices", function(message) {
    // called when the client receives a STOMP message from the server
    if (message.body) {
        createObject(message.body)
     // console.log("got message with body " + message.body)
    } else {
      console.log("got empty message");
    }
  });
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})

 


//Object skeleton to load the initial grid, actual inistal data should be received from an 
//API and then the object should be updated for any update
const tableObject = [
  {
    name: "gbpusd",
    bestBid: 0,
    bestAsk: 0,
    openBid: 0,
    openAsk: 0,
    lastChangeAsk: 0,
    lastChangeBid: 0,
    graph: []
  },
  {
    name: "gbpeur",
    bestBid: 0,
    bestAsk: 0,
    openBid: 0,
    openAsk: 0,
    lastChangeAsk: 0,
    lastChangeBid: 0,
    graph: []
  },
  {
    name: "gbpaud",
    bestBid: 0,
    bestAsk: 0,
    openBid: 0,
    openAsk: 0,
    lastChangeAsk: 0,
    lastChangeBid: 0,
    graph: []
  }
];

var completeObject = [];
var strings;
var time = 0;

renderHTMLtemplate(tableObject); // layout initial grid setup

function createObject(obj) {
    var nameArray = tableObject.map(function (data) {
        return data.name
    })
    var index = nameArray.indexOf(JSON.parse(obj).name);
    if (index >= 0) {
      tableObject[index].bestBid = JSON.parse(obj).bestBid;
      tableObject[index].bestAsk = JSON.parse(obj).bestAsk;
      tableObject[index].openBid = JSON.parse(obj).openBid;
      tableObject[index].openAsk = JSON.parse(obj).openAsk;
      tableObject[index].lastChangeAsk = JSON.parse(obj).lastChangeAsk;
      tableObject[index].lastChangeBid = JSON.parse(obj).lastChangeBid;
      sortObjects(tableObject);
      renderHTMLtemplate(tableObject); //should be a function for updating the html
    }
}

function sortObjects(allobject){
  allobject.sort(function(a,b){
    return b.lastChangeBid - a.lastChangeBid;
  })
}

function emptyGraphArray(len){
  for(var kk = 0; kk < len; kk++){
    tableObject[kk]['graph'] = [];
  }
}

function fillGraphArray(tableObject){
  for (i = 0; i < tableObject.length; i++) {
    tableObject[i]['graph'].push((tableObject[i].bestBid+ tableObject[i].bestAsk)/2);
   }
}

function createGraphElement(tableObject){
  for (i = 0; i < tableObject.length; i++) {
    var sparkElement = '';
    var sparkElement = document.getElementById(("test"+ i).toString());
    Sparkline.draw(sparkElement, tableObject[i]['graph']);
   }
}


function renderHTMLtemplate(tableObject) {
  strings = '';
  for (i = 0; i < tableObject.length; i++) {
      strings += `<tr><td>  ${tableObject[i].name}  </td>
      <td> ${tableObject[i].bestBid} </td>
      <td> ${tableObject[i].bestAsk} </td>
      <td> ${tableObject[i].openBid} </td>
      <td> ${tableObject[i].openAsk} </td>
      <td> ${tableObject[i].lastChangeAsk} </td>
      <td> ${tableObject[i].lastChangeBid}  </td>
      <td id=test${i} >
      <canvas width=100 height=20></canvas></td>
      </tr>`;
      completeObject.push(strings)
  }
  document.getElementById('tbodyId').innerHTML = strings;
  var intervalInstance = setInterval(function(){
  time = time+1;
    if(time > 30){
        emptyGraphArray(tableObject.length);
        time = 0;
    }
    fillGraphArray(tableObject);
    createGraphElement(tableObject);
  }(),1000);
    clearInterval(intervalInstance);
}


