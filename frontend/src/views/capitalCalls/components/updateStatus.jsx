import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Dropdown from '../../../components/form/dropdown';
import Flex from '../../../components/containers/flex';
import * as yup from "yup";

function UpdateStatus ({ visible, onHide, onSave, defaultData = {} }) {
    const [status, setStatus] = useState(defaultData.status , defaultData.id || '');
    const [statusError, setStatusError] = useState('');
    let schema = yup.object().shape({
        status: yup.string().required('Please select a status'),
    });

    const handleInput = async (value) => {
        setStatus(value);
        schema.validate({ status: value })
            .then(() => {
                setStatusError('');
            })
            .catch(err => {
                setStatusError(err.message);
            });
    };

    const handleClose = async () => {
        try {
            await schema.validate({ status }, { abortEarly: false });
        } catch (err) {
            setStatusError(err.message);
            return;
        }
        onSave({ status });
    };

    const handleCancel = () => {
        setStatus(defaultData.status || '');
        setStatusError('');
        onHide();
    };

    useEffect(() => {
        setStatus(defaultData.status || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const capitalCallDialogFooter = (
        <React.Fragment>
            <Flex justifyContent='flex-end'>
                <Button label="Cancel" icon="pi pi-times" onClick={handleCancel} />
                <Button label="Save" icon="pi pi-check" onClick={handleClose} />
            </Flex>
        </React.Fragment>
    );

    return (
        <Dialog visible={visible} style={{ width: '32rem' }} header="Update Status" modal className="p-fluid" footer={capitalCallDialogFooter} onHide={onHide}>
            <Dropdown error={!!statusError} options={['VALIDATED', 'SENT', 'PAID', 'OVERDUE']} onChange={handleInput} value={status} placeholder='Select Status' />
            {statusError && <small className="p-error">{statusError}</small>}
        </Dialog>
    );
}

export default UpdateStatus;
