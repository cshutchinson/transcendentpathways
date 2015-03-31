var React = require('react/addons');
var ControlGroup = require('../../../../components/form/ControlGroup');
var TextControl = require('../../../../components/form/TextControl');
var Button = require('../../../../components/form/Button');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/Admin');


var Component = React.createClass({
    mixins: [ React.addons.LinkedStateMixin ],
    getInitialState: function () {

        return {};
    },
    componentWillReceiveProps: function (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.data.hydrated,
                nameFirst: nextProps.data.name.first,
                nameMiddle: nextProps.data.name.middle,
                nameLast: nextProps.data.name.last
            });
        }
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveDetails({
            id: this.props.data._id,
            name: {
                first: this.state.nameFirst,
                middle: this.state.nameMiddle,
                last: this.state.nameLast
            }
        });
    },
    render: function () {

        var alerts = [];
        if (this.props.data.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. Changes have been saved.
            </div>);
        }
        else if (this.props.data.error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {this.props.data.error}
            </div>);
        }

        var notice;
        if (!this.props.data.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        var formElements;
        if (this.props.data.hydrated) {
            formElements = <fieldset>
                <legend>Details</legend>
                {alerts}
                <TextControl
                    name="nameFirst"
                    label="First name"
                    hasError={this.props.data.hasError['name.first']}
                    valueLink={this.linkState('nameFirst')}
                    help={this.props.data.help['name.first']}
                    disabled={this.props.data.loading}
                />
                <TextControl
                    name="nameMiddle"
                    label="Middle name"
                    hasError={this.props.data.hasError['name.middle']}
                    valueLink={this.linkState('nameMiddle')}
                    help={this.props.data.help['name.middle']}
                    disabled={this.props.data.loading}
                />
                <TextControl
                    name="nameLast"
                    label="Last name"
                    hasError={this.props.data.hasError['name.last']}
                    valueLink={this.linkState('nameLast')}
                    help={this.props.data.help['name.last']}
                    disabled={this.props.data.loading}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{'btn-primary': true}}
                        disabled={this.props.data.loading}>

                        Save changes
                        <Spinner space="left" show={this.props.data.loading} />
                    </Button>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <form onSubmit={this.handleSubmit}>
                {notice}
                {formElements}
            </form>
        );
    }
});


module.exports = Component;
