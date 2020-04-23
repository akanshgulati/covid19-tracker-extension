import React from 'react';
import '../css/Base.css';
import '../css/Checkbox.css';

export default function (props) {
    return <input type='checkbox' checked={props.isChecked} />;
}
