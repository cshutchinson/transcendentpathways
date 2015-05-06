var React = require('react');

var AddItem = React.createClass({
    getIntialState: function(){
        return {
            newItem: ''
        }
    },
    handleChange: function(e){
        this.setState({
            newItem: e.target.value
        })
    },
    handleSubmit: function(e){
        if(e.keyCode===13){
            this.props.add(this.state.newItem);
            this.setState({
                newItem: ''
            });
        }
    },
    render: function(){
        return(
            <div>
                <input type="text"
                       className = "form-control"
                       value = {this.props.newItem}
                       placeholder = "New Note"
                       onKeyDown = {this.handleSubmit}
                       onChange = {this.handleChange} />
            </div>
        )
    }
});

module.exports = AddItem;