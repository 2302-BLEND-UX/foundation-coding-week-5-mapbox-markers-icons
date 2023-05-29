// declare our elements
const flyToLocation = document.getElementById("fly-to-location");
const addNewMarkers = document.getElementById("add-new-markers");

// initialise mapbox
mapboxgl.accessToken = '';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/timstannard99/cli2bu5s1009s01r6guj5fq6c', // style URL
    // find a new location for the center here
    // https://docs.mapbox.com/playground/geocoding/
    center: [174.777211, -41.288795], // starting position [lng, lat]
    zoom: 11, // starting zoom
});



// add icons to the map, and set the modals up
map.on('load', () => {

    // this will add all of our icons
    // cafe icon
    map.loadImage('img/icons/cafe-icon.png', function (error, image) {
        if (error) {
            throw error;
        }
        map.addImage('cafe-icon', image);
    })
    // pool icon
    map.loadImage('img/icons/pool-icon.png', function (error, image) {
        if (error) {
            throw error;
        }
        map.addImage('pool-icon', image);
    })

    // this function adds all our places
    map.addSource(
        'places', {
        // This GeoJSON contains features that include an "icon"
        // property. The value of the "icon" property corresponds
        // to an image in the Mapbox Streets style's sprite.
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            `
                            <img src="https://neatplaces.co.nz/cdn-cgi/image/fit=cover,format=auto,width=650,height=425//media/uploads/places/place/fidels_cafe/Fidels_4.jpg" alt="people sitting at fidels">
                            <h3>Fidels</h3><p>is cafe in Wellington</p>
                            `,
                        'icon': 'cafe-icon'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [174.774232, -41.295922]
                    }
                },
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            `
                            <img src="https://picsum.photos/seed/picsum123/300" alt="people sitting at fidels">
                            <h3>Swimsuit</h3><p>is cafe in Wellington</p>
                            `,
                        'icon': 'cafe-icon'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [174.777211, -41.288795]
                    }
                },
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            `
                            <img src="https://picsum.photos/seed/picsum/300" alt="people sitting at fidels">
                            <h3>Enigma</h3><p>is cafe in Wellington</p>
                            `,
                        'icon': 'cafe-icon'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [174.77896, -41.292563]
                    }
                }

            ]
        }
    });

    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
            'icon-image': ['get', 'icon'],
            'icon-allow-overlap': true
        }
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'places', (e) => {

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
    });
});

// fly to enigma button
flyToLocation.addEventListener("click", function () {
    let lat = 174.77896
    let long = -41.292563
    map.flyTo({
        center: [lat, long],
        zoom: 18
    });
})

// new markers data
const pools = [
    {
        coordinates: [174.867186, -41.142972],
        description: `<img src="https://picsum.photos/seed/pool/200" alt="random iamge">
        <p>This is the Cannon's creek pool boiiiiii</p>
        `,
        icon: 'pool-icon'
    },
    {
        coordinates: [174.904924, -41.213991],
        description: `<img src="https://picsum.photos/seed/pool21312/200" alt="random iamge">
        <p>Huia Pool - staff are angry at each other, but overall cool</p>
        `,
        icon: 'pool-icon'
    }
]

// this function will gather markers from an array and push them to the mapbox map
function addPoolMarkers() {
    // get the marker data
    let existingMarkers = map.getSource('places')._data;

    // loop over our new markers and add them to the mapbox data
    for (let i = 0; i < pools.length; i++) {
        let pool = pools[i];

        // we're declaring a feature object
        // it's a mapbox piece of data, which it needs to know about, in order to add it to the map
        let feature = {
            'type': 'Feature',
            'properties': {
                'description': pool.description,
                'icon': pool.icon
            },
            'geometry': {
                'type': 'Point',
                'coordinates': pool.coordinates
            }
        }
        // we've established/or declared a feature now, within our loop
        // also, this feature can be pushed to mapbox
        existingMarkers.features.push(feature);
    }
    //----end of the loop
    // check our updated markers
    // console.log(existingMarkers);
    // rename existing markers to new markers
    let addNewMarkers = existingMarkers;

    // update the map with the modified data
    map.getSource('places').setData(addNewMarkers);

    // fly to a more suitable place on the map
    map.flyTo({
        center: [174.87360776412174, -41.18343571203791],
        zoom: 10
    });
}

// add new markers - adding pools
addNewMarkers.addEventListener('click', addPoolMarkers)