var React = require('react');

var GoogleMap = React.createClass({
    getInitialState: function(){

        return({
            map:  null
        })
    },
    propTypes: function(){
        return({
            musician: React.PropTypes.object.isRequired,
            facility: React.PropTypes.object.isRequired
        });
    },
    getDefaultProps: function () {
        return {
            initialZoom: 13,
            mapCenterLat: 43.6425569,
            mapCenterLng: -79.4073126
        };
    },
    updateMap: function(){
            var mapOptions = {
                    center: this.mapCenterLatLng3(),
                    zoom: this.props.initialZoom
                };
            var map = new google.maps.Map(this.getDOMNode(), mapOptions);

            //console.log(map);
            //var markerMusician = new google.maps.Marker({
            //    position: this.mapCenterLatLng2(),
            //    title: this.props.musician.performerName, map: map
            //});

            var markerFacility = new google.maps.Marker({
                position: this.mapCenterLatLng3(),
                title: this.props.facility.facilityName,
                map: map
            });
            var markers = [];
            //markers.push(markerMusician, markerFacility);
            markers.push(markerFacility);
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < markers.length; i++) {
                bounds.extend(markers[i].getPosition());
            }
            //map.setCenter(bounds.getCenter());
            //map.fitBounds(bounds);
            //map.setZoom(map.getZoom());
    },

    componentDidUpdate: function () {
        this.updateMap();
    },

    componentDidMount: function(){
        this.updateMap();

    },
    mapCenterLatLng: function () {
        return new google.maps.LatLng(this.props.musician.latitude, this.props.musician.longitude);
    },
    //mapCenterLatLng2: function () {
    //    return new google.maps.LatLng(this.props.musician.latitude, this.props.musician.longitude);
    //},
    mapCenterLatLng3: function () {
        return new google.maps.LatLng(this.props.facility.latitude, this.props.facility.longitude);
    },
    render: function () {

        return (
            <div className="map-gic container-fluid panel panel-primary" >
            </div>
        );
    }
});

module.exports = GoogleMap;