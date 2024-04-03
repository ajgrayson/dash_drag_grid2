/* eslint no-magic-numbers: 0 */
import React, { useState } from 'react';

import { ToolBoxGrid } from '../lib';

const App = () => {

    const [state, setState] = useState({value:'', label:'Type Here'});
    const setProps = (newProps) => {
            setState(newProps);
        };

    return (
        <div>
            <ToolBoxGrid
                setProps={setProps}
                {...state}
            />
        </div>
    )
};


export default App;
