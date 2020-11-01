import React from 'react'
// Start Openlayers imports
import {Map, View,} from 'ol'
import {Tile as TileLayer,} from 'ol/layer'
import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import Circle from 'ol/geom/Circle';
import OSM from "ol/source/OSM";
import Style from 'ol/style/Style';
import axios from 'axios';
import VectorSource from 'ol/source/Vector';
import Feature from "ol/Feature";
import {fromLonLat} from 'ol/proj';
import Text from 'ol/style/Text';
import Stroke from 'ol/style/Stroke';
import Fill from "ol/style/Fill";

/***
 * Used to make requests
 * @type {AxiosInstance}
 */
const api = axios.create({
    baseURL: "http://localhost"
});


class openLayerMap extends React.Component {

    constructor(props) {
        super(props);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.state = {
            coronaLocations: [],
            zoom: 0,
            mercator: [],
            layers: []
        };
    }

    updateDimensions() {
        const h = window.innerWidth >= 992 ? window.innerHeight : 400;
        this.setState({height: h});
    }

    /**
     * Sets the size of the map on the browser
     */
    componentWillMount() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
    }

    componentDidMount() {
        /***
         * Creates the map
         * @type {Map}
         */
        this.olMap = new Map({
            //  Display the map in the div with the id of map
            target: 'map',
            layers: [
                new TileLayer({source: new OSM()})
            ],
            // Render the tile layers in a map view with a Mercator projection
            view: new View({
                center: fromLonLat([4.895168,52.370216]),
                zoom: 15
            })
        });

        this.getLocationsFromDb().then(data => {
            data.forEach(location => {
                this.getLonLatFromCity(location)
                    .then(longAndLat => {
                        this.createCircleOnMap(location, fromLonLat(longAndLat))
                    });
            })
        });

    }

    checkZoom(){
        var zoom = this.olMap.getView().getZoom();
        this.state.zoom = zoom * 1.2;
    }

    /***
     * Creates circles on a map
     * @param locations
     * @param coordinates The cordinates for the circle
     */
    createCircleOnMap(locations, coordinates) {
     this.getRadiusTimesTooClose(locations).then(
            data =>{
                this.checkZoom();
                var myStyle = new Style ({
                    fill: new Fill({
                        color: 'rgba(255,100,50,0.5)'
                    }),
                    stroke: new Stroke({
                        color: 'blue',
                        width: 2
                    }),
                    text: new Text({
                        text: data[1][0],
                        font:  this.state.zoom + 'px Calibri,sans-serif',
                        fill: new Fill({
                            color: '#FFFFFF'
                        }),
                    })
                });

                const layerMap = new VectorLayer({
                    style: myStyle,
                    source: new VectorSource({
                        projection: 'EPSG:4326',
                        // radius = 4000 meters
                        features: [new Feature(new Circle(coordinates, data[0]))]
                    }),
                });
                this.olMap.addLayer(layerMap);
            }
        );
    }

    /***
     *
     * @param location
     * @returns {Promise<*[]>} returns the amount of times people got too close in a location and the fitting radius for the circle
     */
    async getRadiusTimesTooClose(location) {
        var standardRadius = 1000;
        var radiusMultiplier;

        const response = await this.getTimesTooClose(location);
        radiusMultiplier = (Math.floor(response / 50));
        return [standardRadius + (250 *radiusMultiplier), response];
    }


    /***
     *
     * Returns the lon and lat of a city
     * @param city
     * Name of a city
     * @returns {Promise<void>}
     */
    async getLonLatFromCity(city) {
        var apikey = '313dc5a196df42859623c7089df4cff4';
        var api_url = 'https://api.opencagedata.com/geocode/v1/json';

        var request_url = api_url
            + '?'
            + 'key=' + apikey
            + '&q=' + city
            + '&pretty=1'
            + '&no_annotations=1';

        const response = await axios.get(request_url);
        return [response.data.results[0].geometry.lng, response.data.results[0].geometry.lat]
    }

    /***
     * Gets all the locations from the database
     * @returns {Promise<[]>} the locations
     */
    async getLocationsFromDb() {
        const response = await api.get('http://127.0.0.1', {
            headers: {
                'Authorization': `Bearer !HvaIot!`
            }
        });

        var locations = [];
        for (var i = 0; i < response.data.length; i++) {
            locations[i] = response.data[i].location
        }
        return locations
    }


    /***
     *
     * @param location
     * @returns {Promise<[]>} returns the amount of times people got too close given a location
     */
    async getTimesTooClose(location) {
        const response = await api.get('http://127.0.0.1?location=\"' + location + "\"", {
            headers: {
                'Authorization': `Bearer !HvaIot!`
            }
        });
        var timesTooClose = [];
        for (var i = 0; i < response.data.length; i++) {
            timesTooClose[i] = response.data[i]
        }
        return timesTooClose
    }

    render() {
        const style = {
            width: '60%',
            height: this.state.height,
            margin: "auto",
            padding: 10
        };
        return (
            <div id='map' style={style}>
            </div>
        )
    }
}

export default openLayerMap