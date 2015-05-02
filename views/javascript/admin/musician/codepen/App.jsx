var React = require('react/addons');
var _ = require('lodash');


var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var MusicianFields = React.createClass({
    render: function() {
        return (
            <div>

                <form className="form-horizontal" action='/admin/UpdateMusicianDetails' method='POST'>
                    <div className="form-group">
                        <input type='hidden' name='csrf-token'  value='_csrf'> </input>
                        <label className="col-sm-4 control-label"> Performer Name</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="performerName"
                                   defaultValue={this.props.fieldValues.performerName} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-4 control-label">Contact Name</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="contactName"
                                   defaultValue={this.props.fieldValues.contactName} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Phone</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="phone"
                                   defaultValue={this.props.fieldValues.phone} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Address Line 1</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="address1"
                                   defaultValue={this.props.fieldValues.address1} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Address Line 2</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="address2"
                                   defaultValue={this.props.fieldValues.address2} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">City</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="city"
                                   defaultValue={this.props.fieldValues.city} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">State</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="state"
                                   defaultValue={this.props.fieldValues.state} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Zip Code</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="zipcode"
                                   defaultValue={this.props.fieldValues.zipcode} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Website URL</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="website"
                                   defaultValue={this.props.fieldValues.website} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Biography</label>
                        <div>
                            <textarea className="col-sm-7"  rows="2"
                                      ref="biography" defaultValue={this.props.fieldValues.biography} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Instruments</label>
                        <div>
                            <textarea className="col-sm-7"  rows="2"
                                      ref="instruments" defaultValue={this.props.fieldValues.instruments} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-4 control-label">Picture</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="picture"
                                   defaultValue={this.props.fieldValues.picture} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Approval Date</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="approvedDate"
                                   defaultValue={this.props.fieldValues.approvedDate} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Approved By</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="approvedBy"
                                   defaultValue={this.props.fieldValues.approvedBy} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Sign-Up Date</label>
                        <div>
                            <input type="text" className="col-sm-7" ref="signUpDate"
                                   defaultValue={this.props.fieldValues.signUpDate} />
                        </div>
                    </div>
                    <div className ="form-group">
                        <label className="col-sm-4 control-label">Approved To Perform</label>
                        <div>
                            <select className="col-sm-7" defaultValue={this.props.fieldValues.approved}
                                    ref="approved">
                                <option value="">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-primary" onClick={this.saveAndContinue}>Submit</button>
                    </div>
                </form>
            </div>
        )
    },
    saveAndContinue: function(event) {
        event.preventDefault();

        var data = {
            _id: this.props.fieldValues._id,
            performerName: this.refs.performerName.getDOMNode().value,
            contactName: this.refs.contactName.getDOMNode().value,
            phone: this.refs.phone.getDOMNode().value,
            address1: this.refs.address1.getDOMNode().value,
            address2: this.refs.address2.getDOMNode().value,
            city: this.refs.city.getDOMNode().value,
            state: this.refs.state.getDOMNode().value,
            zipcode: this.refs.zipcode.getDOMNode().value,
            website: this.refs.website.getDOMNode().value,
            biography: this.refs.biography.getDOMNode().value,
            instruments: this.refs.instruments.getDOMNode().value,
            picture: this.refs.picture.getDOMNode().value,
            approvedDate: this.refs.approvedDate.getDOMNode().value,
            approvedBy: this.refs.approvedBy.getDOMNode().value,
            signUpDate: this.refs.signUpDate.getDOMNode().value,
            approved: this.refs.approved.getDOMNode().value
        };
        this.props.saveValues(data);


    }
});

var DetailsBar = React.createClass({
    render: function(){
        return (
            <div className="Detail">

                <div className="panel-body">
                    <MusicianFields  fieldValues = {this.props.musician}
                                     saveValues = {this.props.saveValues}
                        />
                </div>

            </div>
        )}
});

var MusicianRow = React.createClass({
    propTypes: {
        musician: React.PropTypes.any.isRequired,
        showDetails: React.PropTypes.func.isRequired
    },
    getInitialState: function(){
        return {
            showResults: this.props.showResults
        }
    },
    changeState: function(musician){
        this.props.showDetails(musician);
    },
    render: function() {
        var name = this.props.musician.approved ?
            this.props.musician.performerName :<span style={{color: 'blue'}}>
                {this.props.musician.performerName}
            </span>;
        return (
            <a href="#" className="list-group-item" key={this.props.musician._id}
               onClick={this.changeState.bind(this, this.props.musician)}><h4> {name}</h4> </a>
        );
    }
});

var MusicianTable = React.createClass({
    propTypes: {
        //musicians: React.PropTypes.array.isRequired
    },
    getDefaultProps: function(){
        return {
            source: '/musicianData',
            postRoute: '/admin/updateMusicianDetails'
        }
    },
    getInitialState: function(){
        return {
            musicians: [],
            showResults: false,
            musician: null,
            token: this.props.token
        }
    },
    showDetails: function(musician){

        this.setState({
            showResults: !this.state.showResults,           //problem here for show details for a new click
            musician: musician                              //React.unmountComponentAtNode(document.getElementById('container')
        })
    },
    saveValues: function(fields) {
        var x = this.state.musician;
        x._id = fields._id;
        x.performerName = fields.performerName;
        x.contactName = fields.contactName;
        x.phone = fields.phone;
        x.address1 = fields.address1;
        x.address2 = fields.address2;
        x.city = fields.city;
        x.state = fields.state;
        x.zipcode = fields.zipcode;
        x.website = fields.website;
        x.biography = fields.biography;
        x.instruments = fields.instruments;
        x.picture = fields.picture;
        x.approvedDate = fields.approvedDate;
        x.approvedBy = fields.approvedBy;
        x.signUpDate = fields.signUpDate;
        x.approved = fields.approved;

        this.handleChangedData(x);
    },
    handleChangedData: function(musician){
        var x = this.state.musicians;
        x.forEach(function(elem,index){
            if (elem._id===musician._id){
                x[index] = musician;
            }
        }.bind(this));
        this.setState({
            musicians: x,
            musician: musician,
            showResults: false
        });
        //save admin changes to the musician here with this.state.musician
        // exports.postUpdateMusicianDetails used in admin.js controller
        // route create in app.js /admin/updateMusicianDetails-->this.state.postRoute
        // jQuery.post( url [, data ] [, success ] [, dataType ] )
        $.post(this.props.postRoute, this.state.musician, function(result){
            //console.log(result);
        });
    },
componentDidMount: function() {                                 //csh loading the musicians into this.state.musicians
        $.get(this.props.source, function(result) {
            var musicianData = result;
            if (this.isMounted()) {
                this.setState({
                    musicians: musicianData
                });
            }
        }.bind(this));



},
    render: function() {
        var rowsApproved = [];
        var rowsNotApproved = [];
        this.state.musicians.forEach(function(musician) {
            if (musician.approved != false){
                rowsApproved.push(
                    <MusicianRow
                        musician = {musician}
                        key = {musician.performerName}
                        showDetails={this.showDetails}
                        />
                );
            } else {
                rowsNotApproved.push(
                    <MusicianRow
                        musician = {musician}
                        key= {musician.performerName}
                        showDetails={this.showDetails}
                        showResults={this.state.showResults}
                        />
                );
            }
        }.bind(this));
        return (
            <div className="col-sm-4">
                <div className="list-group PerformerList">
                    <a href="#" className="list-group-item active"> Performer List</a>
                    {rowsNotApproved} {rowsApproved}
                </div>
                <div>
                    <ReactCSSTransitionGroup transitionName="example">
                        {this.state.showResults ? <DetailsBar ref="detailWindow" musician={this.state.musician}
                            handleChangedData={this.handleChangedData} saveValues={this.saveValues} />: null }
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
});




React.render(<MusicianTable token={document.getElementsByTagName('csrf-token')} />, document.getElementById("codepenApp"));

