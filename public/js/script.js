let map;
let drawnOverlays = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 49.1666, lng: -123.1336 },
        zoom: 13
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
            icon: {
                url: "./meat.png",
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            }
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

    // Event listener pushes a reference of the object into array each time. 
    google.maps.event.addListener(drawingManager, 'circlecomplete', function (circle) {
        drawnOverlays.push(circle);
    });

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        drawnOverlays.push(polygon);
    });

    google.maps.event.addListener(drawingManager, 'markercomplete', function (marker) {
        drawnOverlays.push(marker);
    });
}

// Uses the reference of objects and sets them to null
function clearAllOverlays() {
    for (let shape of drawnOverlays) {
        shape.setMap(null);
    }
    drawnOverlays = [];
}

function saveLocations() {
    drawnOverlays.forEach((overlay) => {
        let locationData = {};

        if (overlay instanceof google.maps.Circle) {
            locationData.type = 'circle';
            locationData.coordinates = [
                overlay.getCenter().lat(),
                overlay.getCenter().lng(),
                overlay.getRadius()
            ];
        } else if (overlay instanceof google.maps.Polygon) {
            locationData.type = 'polygon';
            locationData.coordinates = overlay.getPath().getArray().map(coord => [coord.lat(), coord.lng()]);
        } else if (overlay instanceof google.maps.Marker) {
            locationData.type = 'marker';
            locationData.coordinates = [overlay.getPosition().lat(), overlay.getPosition().lng()];
        }
        fetch('/api/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(locationData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}





