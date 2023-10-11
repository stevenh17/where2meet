let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 49.1666, lng: -123.1336 },
        zoom: 13
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    let request = {
        origin: 'Richmond, BC',
        destination: 'Vancouver, BC',
        travelMode: 'DRIVING',
    };

    directionsService.route(request, function (response, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            console.error("Directions request failed due to " + status);
        }
    });

    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.CIRCLE,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                // google.maps.drawing.OverlayType.RECTANGLE,
                google.maps.drawing.OverlayType.MARKER
                // google.maps.drawing.OverlayType.POLYLINE,
            ],
        },
        markerOptions: {
            icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        },
        circleOptions: {
            fillColor: "#000",
            fillOpacity: 0.2,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1,
        },
    });

    drawingManager.setMap(map);
}

function extractLocations(text) {
    const matches = text.match(/"([^"]+)"/g);
    const errorMessageElement = document.getElementById("errorMessage");
    if (matches && matches.length === 2) {
        errorMessageElement.textContent = '';
        return {
            origin: matches[0].replace(/"/g, ''),
            destination: matches[1].replace(/"/g, '')
        };
    } else {
        errorMessageElement.textContent = 'Please provide two locations in the format "Location1" "Location2".';
        return null;
    }
}


function addBulletPoint() {
    const inputText = document.getElementById("inputText");
    const bulletPointList = document.getElementById("bulletPointList");

    if (inputText.value.trim() !== "") {
        const locations = extractLocations(inputText.value);

        if (locations) {
            const request = {
                origin: locations.origin,
                destination: locations.destination,
                travelMode: 'DRIVING'
            };

            directionsService.route(request, function (response, status) {
                if (status == 'OK') {
                    directionsRenderer.setDirections(response);
                } else {
                    console.error("Directions request failed due to " + status);
                }
            });

            const listItem = document.createElement("li");

            // Create a span to hold the text
            const textSpan = document.createElement("span");
            textSpan.textContent = inputText.value;

            // Create a delete button for each item
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
                bulletPointList.removeChild(listItem);
            };

            // Append the text and delete button to the list item
            listItem.appendChild(textSpan);
            listItem.appendChild(deleteButton);

            // Append the list item to the list
            bulletPointList.appendChild(listItem);

            // Clear the input field for the next entry
            inputText.value = "";
        }
    }
}

// HTML CODE
{/* <div class="container-fluid">
<span class="text-danger" id="errorMessage""></span>
<div class=" row align-items-start">
  <div class="col-2">
    <input type="text" class="form-control" id="inputText"
      placeholder="&quot;Location 1&quot; &quot;Location 2&quot;">
  </div>
  <div class="col">
    <button onclick="addBulletPoint()">Add Route</button>
  </div>
  <ul id="bulletPointList"></ul>
</div> */}