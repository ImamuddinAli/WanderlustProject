    // let mapToken = mapToken;
    mapboxgl.accessToken = mapToken;
    // console.log(mapToken);
    const map = new mapboxgl.Map({
        container: "map",
    // container ID 1/ Choose from Mapbox's core styles, or make your own style with Mapbox St
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: [77.2090, 28.6139], // starting position [ing, lat]
    zoom: 9
    });
