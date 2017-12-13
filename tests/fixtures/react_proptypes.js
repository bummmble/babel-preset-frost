import React from 'react';
import PropTypes from 'prop-types';

class Test extends React.Component {
    render() {
        return <div>{this.props.test}</div>
    }
}

Test.propTypes = {
    test: PropTypes.string
}
