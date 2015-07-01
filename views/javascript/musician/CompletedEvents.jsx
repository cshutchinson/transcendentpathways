var React = require('react');

var CompletedEvents = React.createClass ({

    render: function(){
        return (
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12">
                                Completed Events
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel-body">
                    <div className="container-fluid">
                        <div className="row">
                            {this.props.completedEvents}
                        </div>
                    </div>
                </div>
            </div>
        );

    }
});

module.exports = CompletedEvents;