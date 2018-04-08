import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { App as DumbApp } from '../components';
import { postMessage, init, closePopup, showPopup } from '../actions';
import { connection } from '../connection';

class App extends React.Component {
  componentDidMount() {
    window.addEventListener('message', (event) => {
      if (event.data.fromPublisher) {
        // receive show popup command from publisher
        if (event.data.action === 'showPopup') {
          this.props.showPopup();
        }
      }
    });
  }

  render() {
    const { isPopupVisible, isFormVisible, isCalloutVisible, formData } = this.props;
    const { loadType } = formData;

    const extendedProps = { ...this.props };

    let parentClass;
    let containerClass;

    if (loadType === 'popup') {
      if (isPopupVisible) {
        parentClass = 'erxes-modal-iframe';
        containerClass = 'modal-form open';
      } else {
        parentClass = 'erxes-modal-iframe hidden';
        containerClass = 'modal-form';
      }
    }

    if (loadType === 'slideInLeft') {
      parentClass = 'erxes-slide-left-iframe';
      containerClass = 'container-slide-in-left';
    }

    if (loadType === 'slideInRight') {
      parentClass = 'erxes-slide-right-iframe';
      containerClass = 'container-slide-in-right';
    }

    if (loadType === 'dropdown') {
      parentClass = 'erxes-dropdown-iframe';
      containerClass = 'container-dropdown';

      if (isCalloutVisible) {
        containerClass += ' call-out';
      }
    }

    if (loadType === 'embedded') {
      parentClass = 'erxes-embedded-iframe';
      containerClass = 'container-embedded';

      if (isFormVisible) {
        parentClass += ' visible-form';
      }
    }

    if (['slideInRight', 'slideInLeft', 'dropdown'].includes(loadType)) {
      if (isFormVisible) {
        parentClass += ' visible-form';
        containerClass += ' visible-form';
      }
    }

    if (loadType === 'shoutbox') {
      if (isCalloutVisible || isFormVisible) {
        parentClass = 'erxes-shoutbox-iframe';
      } else {
        parentClass = 'erxes-shoutbox-iframe erxes-hidden';
      }

      containerClass = 'container-shoutbox';
    }

    postMessage({
      action: 'changeContainerClass',
      className: parentClass,
    });

    extendedProps.containerClass = containerClass;

    return <DumbApp {...extendedProps} />;
  }
}

const mapStateToProps = state => ({
  isPopupVisible: state.isPopupVisible,
  isFormVisible: state.isFormVisible,
  isCalloutVisible: state.isCalloutVisible,
  formData: connection.data.formData,
});

const mapDisptachToProps = dispatch => ({
  init() {
    dispatch(init());
  },

  closePopup() {
    dispatch(closePopup());
  },

  showPopup() {
    dispatch(showPopup());
  },
});

App.propTypes = {
  formData: PropTypes.object,
  isPopupVisible: PropTypes.bool,
  isFormVisible: PropTypes.bool,
  isCalloutVisible: PropTypes.bool,
  showPopup: PropTypes.func,
}

export default connect(mapStateToProps, mapDisptachToProps)(App);
