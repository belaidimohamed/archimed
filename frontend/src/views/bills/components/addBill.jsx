import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Input from '../../../components/form/input';
import Flex from '../../../components/containers/flex';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import Dropdown from '../../../components/form/dropdown';

function AddBillDialog({ visible, onHide, onSave, defaultData = {}, investors }) {
    const navigate = useNavigate();

    const [bill, setBill] = useState(defaultData || { investor: null,  bill_type: '', due_date: '' });
    const [billError, setBillError] = useState({ investor: false, bill_type: false, due_date: false });

    let schema = yup.object().shape({
        investor: yup.string().required('Please select an investor'),
        bill_type: yup.string().required('Please enter the bill type'),
        due_date: yup.date().required('Please enter the due date'),
    });

    const handleInput = async (attribute, value) => {
        setBill(bill => ({ ...bill, [attribute]: value }));
        schema.validateAt(attribute, { [attribute]: value })
            .then(resp => {
                setBillError(billError => ({ ...billError, [attribute]: '' }));
            })
            .catch(err => {
                setBillError(billError => ({ ...billError, [err.path]: err.message }));
            });
    };

    const handleClose = async () => {
        try {
            await schema.validate(bill, { abortEarly: false });
        } catch (err) {
            const pathToMessage = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setBillError(pathToMessage);
            return;
        }
        onSave(bill);
    };

    const handleCancel = () => {
        setBill({ investor: null, bill_type: '', due_date: '' });
        setBillError({ investor: false, bill_type: false, due_date: false });
        onHide();
    };

    const goInvestors = () => {
        navigate('/investors');
    };
    const mapInvestors = (data) => {
        const array = []
        data.forEach((item)=> {
            array.push({label:item.email+' - '+item.amount_invested, value:item.id})
        })
        return array
    }
    useEffect(() => {
        if (!defaultData)
            setBill({});
        else
            setBill(defaultData);
    }, [visible]);

    const billDialogFooter = (
        <React.Fragment>
            <Flex justifyContent='flex-end'>
                <Button label="Cancel" icon="pi pi-times" onClick={handleCancel} />
                <Button label="Save" icon="pi pi-check" onClick={handleClose} />
            </Flex>
        </React.Fragment>
    );
    const billTypeOptions = [
        { label: 'Membership', value: 'Membership' },
        { label: 'Upfront fees', value: 'Upfront fees' },
        { label: 'Yearly fees', value: 'Yearly fees' }
    ];

    return (
        <Dialog visible={visible} style={{ width: '32rem' }} header="Add Bill" modal className="p-fluid" footer={billDialogFooter} onHide={onHide}>
            <Dropdown error={billError.investor} options={mapInvestors(investors)} onChange={(value) => handleInput('investor', value)} value={bill.investor} placeholder='Investor' />
            <Dropdown error={billError.bill_type} options={billTypeOptions} onChange={(value) => handleInput('bill_type', value)} value={bill.bill_type} placeholder='Bill Type' />
            <Input error={billError.due_date} onChange={(value) => handleInput('due_date', value)} value={bill.due_date} placeholder='Due Date' type='date' />
            <br />
            <hr />
            <br />
            <div>Don't have an investor? <a onClick={goInvestors} href=''>Click here to add a new one</a></div>
        </Dialog>
    );
}

export default AddBillDialog;
