import React from 'react';
import PropTypes from 'prop-types';

import {NROWS, NCOLS} from '../constants';

import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import './style.css';

/**
 * DashboardItemResponsive is a wrapper that is intended to be used with ResponsiveGridlayout and ToolBoxGrid.
 * DashboardItemResponsive specify the position and size of the item on the dashboard and if it is in the toolbox.
 */
export default class DashboardItemResponsive extends React.Component {
    render() {
        const {children, inToolbox, defaultName} = this.props;
        return children;
    }
}

DashboardItemResponsive.defaultProps = {
    x: 0,
    y: 0,
    w: NCOLS,
    h: NROWS,
    isDashboardItem: true,
    inToolbox: false,
};

DashboardItemResponsive.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
    x: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,

    /**
     * The position on the y axis (the unit is 30px, by default)
     */
    y: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,

    /**
     * The width of the x axis (default is 6).
     */
    w: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,

    /**
     * The height on the of y axis (default is 4)
     */
    h: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,

    /**
     * If true, equal to `isDraggable: false, isResizable: false`.
     */
    static: PropTypes.bool,

    /**
     * If false, will not be draggable. Overrides `static`.
     */
    isDraggable: PropTypes.bool,
    /**
     * If false, will not be resizable. Overrides `static`.
     */
    isResizable: PropTypes.bool,

    /**
    Is is bounded
    */
    isBounded: PropTypes.bool,
    /**
     * Set the max height
     */
    maxH: PropTypes.number,
    /**
     * Set the max width
     */
    maxW: PropTypes.number,
    /**
     * Set the min height
     */
    minH: PropTypes.number,
    /**
     * Set the min width
     */
    minW: PropTypes.number,
    /**
     * Shows if it was moved
     */
    moved: PropTypes.bool,
    /**
     * Set the resizeHandles
     */
    resizeHandles: PropTypes.string,

    /**
     * This is an internal prop used to identify the component, this property default value is True.
     * Setting this value to false is equivalent to not using the DashboardItem wrapper.
     */
    isDashboardItem: PropTypes.bool,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,
    /**
     * Is the Item in the toolbox. Default is false and set by the grid. Overwrites the grid default value
     */
    inToolbox: PropTypes.bool,

    /**
     * The name which will be displayed if the Item is in the toolbox. If non provided, then default is the ID
     */
    defaultName: PropTypes.string,
};
