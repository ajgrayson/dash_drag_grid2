import React from 'react';
import PropTypes from 'prop-types';

import {NROWS, NCOLS} from '../constants';

import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import './style.css';

/**
 * ToolboxItem is a wrapper that is intended to be used with ToolBoxGrid.
 * ToolboxItem specify the position and size of the item on the dashboard and if it is in the toolbox.
 */
export default class ToolboxItem extends React.Component {
    render() {
        const {children, defaultName} = this.props;
        return children;
    }
}


ToolboxItem.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

    /**
     * The child or list of children wrapped by the component.
     */
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),

    /**
     * The position on the x axis in number of columns (by default, the  max is 12).
     */
    x: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),

    /**
     * The position on the y axis (the unit is 30px, by default)
     */
    y: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),

    /**
     * The width of the x axis (default is 6).
     */
    w: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),

    /**
     * The height on the of y axis (default is 4)
     */
    h: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),

    /**
     * The name which will be displayed if the Item is in the toolbox. If non provided, then default is the ID
     */
    defaultName: PropTypes.string
};
