var Dispatcher = require('flux-dispatcher');
var FluxStore = require('flux-store');
var CloneDeep = require('lodash/lang/cloneDeep');
var Constants = require('../Constants');


var ActionTypes = Constants.ActionTypes;


var Store = FluxStore.extend({
    dispatcher: Dispatcher,
    state: {},
    defaultState: {
        hydrated: false,
        loading: false,
        success: false,
        error: undefined,
        hasError: {},
        help: {},
        name: {},
        timeCreated: undefined
    },
    getState: function () {

        return this.state;
    },
    reset: function () {

        this.state = CloneDeep(this.defaultState);
    },
    setLoadingState: function () {

        this.state.loading = true;
        this.state.success = false;
        this.state.error = undefined;
        this.state.hasError = {};
        this.state.help = {};
    },
    handleResponseErrors: function (data) {

        var self = this;
        this.state.loading = false;
        this.state.success = data.success;

        if (this.state.success) {
            setTimeout(function () {

                self.state.success = undefined;
                self.emitChange();
            }, 2500);
        }

        var validation = data.validation;
        if (validation && validation.keys) {
            var forField = validation.keys.pop();
            this.state.hasError[forField] = true;
            this.state.help[forField] = data.message;
        }
        else if (data.message) {
            this.state.error = data.message;
        }
    },
    onDispatcherAction: function (payload) {

        var action = payload.action;

        if (ActionTypes.GET_ACCOUNT_SETTINGS === action.type) {
            this.setLoadingState();
            this.state.hydrated = false;
            this.emitChange();
        }

        if (ActionTypes.GET_ACCOUNT_SETTINGS_RESPONSE === action.type) {
            this.handleResponseErrors(action.data);
            this.state.hydrated = true;
            this.state.name = action.data.name;
            this.state.timeCreated = action.data.timeCreated;
            this.emitChange();
        }

        if (ActionTypes.SAVE_ACCOUNT_SETTINGS === action.type) {
            this.setLoadingState();
            this.emitChange();
        }

        if (ActionTypes.SAVE_ACCOUNT_SETTINGS_RESPONSE === action.type) {
            this.handleResponseErrors(action.data);
            this.emitChange();
        }
    }
});


module.exports = Store;
