import React from 'react'
import Grid from '@material-ui/core/Grid'

// Start Openlayers imports
import {
    Map,
    View
} from 'ol'
import {
    GeoJSON,
    XYZ
} from 'ol/format'
import {
    Tile as TileLayer,
    Vector as VectorLayer
} from 'ol/layer'
import {
    Vector as VectorSource,
    OSM as OSMSource,
    XYZ as XYZSource,
    TileWMS as TileWMSSource
} from 'ol/source'
import {
    Select as SelectInteraction,
    defaults as DefaultInteractions
} from 'ol/interaction'
import {
    Attribution,
    ScaleLine,
    ZoomSlider,
    Zoom,
    Rotate,
    MousePosition,
    OverviewMap,
    defaults as DefaultControls
} from 'ol/control'
import {
    Style,
    Fill as FillStyle,
    RegularShape as RegularShapeStyle,
    Stroke as StrokeStyle
} from 'ol/style'

import {
    Projection,
    get as getProjection
} from 'ol/proj'
import OSM from "ol/source/OSM";
import {click} from "ol/events/condition";

// End Openlayers imports

class openLayerMap extends React.Component {
    constructor(props) {
        super(props);
        this.updateDimensions = this.updateDimensions.bind(this)
    }

    updateDimensions() {
        const h = window.innerWidth >= 992 ? window.innerHeight : 400;
        this.setState({height: h})
    }

    componentWillMount() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
    }

    componentDidMount() {

        // Create an Openlayer Map instance with two tile layers
        const openLayerMap = new Map({
            //  Display the map in the div with the id of map
            target: 'map',
            layers: [
                new TileLayer({source: new OSM()})
            ],
            // Render the tile layers in a map view with a Mercator projection
            view: new View({
                center: [545331.5341742864, 6868641.475874464],
                zoom: 15
            })
        });
        console.log("test");
        openLayerMap.on("click", function (e) {
            console.log(e.coordinate)
        })

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
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