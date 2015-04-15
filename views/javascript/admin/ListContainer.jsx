var React = require('react');
var AddItem = require('./AddItem.jsx');
var List = require('./List.jsx');


var ListContainer = React.createClass({
    getInitialState: function(){
        return {
            list: []
        }
    },
    componentDidMount: function() {
        $.get('/userData', function(result) {
            if (this.isMounted()) {
                this.setState({
                    list: result
                });
            }
        }.bind(this));
    },
    handleAddItem: function(newItem){
        this.setState({
            list: this.state.list.concat([newItem])
        });
    },
    handleRemoveItem: function(index){
        var newList = this.state.list;
        newList.splice(index,1);
        this.setState({
            list: newList
        })
    },
    render: function(){
        return (
            <div className="col-sm-6 col-md-offset-3">
                <div className="col-sm-12">
                    <h3 className="text-center"> User List </h3>
                    <AddItem add={this.handleAddItem}/>
                    <List items={this.state.list} remove={this.handleRemoveItem}/>
                </div>
            </div>
        )
    }
});

module.exports = ListContainer;