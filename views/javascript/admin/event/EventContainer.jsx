var React = require('react');
var EventCard = require('./EventCard.jsx');


var EventContainer = React.createClass({
    getDefaultProps: function() {
        return {
            source: '/homeAdminEventData',
            postRoute: '/admin/updateEventDetails',
            facilitySource: '/getFacilityInfo'
        }
    },
    getInitialState: function(){
        return {
            events: [],
            event: [],
            showResults: false,
            facility: []
        }
    },

    componentDidMount: function() {                                 //csh loading the events into this.state.events
        $.get(this.props.source, function(result) {
            var eventData = result;
            this.setState({
                events: eventData
            });
        }.bind(this));

    },

    showDetails: function(eventNew){
        this.setState({
            showResults: true,
            event: eventNew
        });
    },
    getCSRFTokenValue: function() {
        var metas = document.getElementsByTagName('meta');

        for (var i=0; i<metas.length; i++) {
            if (metas[i].getAttribute("name") == 'csrf-token') {
                return metas[i].getAttribute('content');
            }
        }
        return '';
    },
    getFacilityInfo: function(facilityName){
        var facility={};
        $.ajaxSetup({
            headers: {
                'X-CSRF-Token': this.getCSRFTokenValue()
            }
        });
        $.post(this.props.facilitySource, {name: facilityName}, function(result){
            facility = result;
            this.setState({
                facility: facility
            });
        }.bind(this));
    },

    render: function(){
        var completeEvents = [];
        var upcomingEvents = [];
        this.state.events.forEach(function(event) {
            if (event.startTime >= new Date()){
                upcomingEvents.push(
                    <EventCard
                        event = {event}
                        key = {event._id}
                        getFacilityInfo = {this.getFacilityInfo}
                        facility = {this.state.facility}
                    />
                );
            } else {
                completeEvents.push(
                    <EventCard
                        event = {event}
                        key = {event._id}
                        getFacilityInfo = {this.getFacilityInfo}
                        facility = {this.state.facility}
                    />
                );
            }
        }.bind(this));
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 ">
                            {upcomingEvents}
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 ">
                            {completeEvents}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

React.render(<EventContainer />, document.getElementById("eventAdmin"));