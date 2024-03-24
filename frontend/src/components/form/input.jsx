import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React from 'react';

function Input({value,label='',placeholder='',error='',onChange,...props}) {

    return (
        <div className="field">
            <label htmlFor="name" className="font-bold">
                {label}
            </label>
            <InputText {...props} placeholder={placeholder? placeholder: label} defaultValue={value}  onChange={(e) => onChange(e.target.value)} required autoFocus className={classNames({ 'p-invalid': error })} />
            {error && <small className="p-error"> {error} </small>}
        </div>
    );
}

export default Input;