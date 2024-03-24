import React from 'react';
import { classNames } from 'primereact/utils';
import { Dropdown as Drop } from 'primereact/dropdown';
        
function Dropdown({value,label='',options=[],placeholder='Select',error='',onChange,...props}) {
    return (
        <div className="field">
            <label htmlFor="name" className="font-bold">
                {label}
            </label>
            <br />
            <Drop {...props} placeholder={placeholder? placeholder: label} options={options} value={value} onChange={(e) => onChange(e.value)} required autoFocus className={classNames({ 'p-invalid':error })} />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
}

export default Dropdown;