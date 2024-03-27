import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Input from '../../../components/form/input';
import Flex from '../../../components/containers/flex';
import * as yup from "yup";
import Dropdown from '../../../components/form/dropdown';

function AddInvestorDialog({ visible, onHide, onSave, defaultData = {} }) {

    const [investor, setInvestor] = useState(defaultData || { name: '', email: '', amount_invested: '' , billing_type:''});
    const [investorError, setInvestorError] = useState({ name: false, email: false, amount_invested: false , billing_type:false });

    let schema = yup.object().shape({
        name: yup.string().required('Please enter a name'),
        email: yup.string().email('Invalid email').required('Please enter an email'),
        amount_invested: yup.number().required('Please enter the amount invested'),
        billing_type: yup.string().required('Please select a billing method'),
    });

    const handleInput = async (attribute, value) => {
        setInvestor(investor => ({ ...investor, [attribute]: value }));
        schema.validateAt(attribute, { [attribute]: value })
            .then(() => {
                setInvestorError(investorError => ({ ...investorError, [attribute]: '' }));
            })
            .catch(err => {
                setInvestorError(investorError => ({ ...investorError, [err.path]: err.message }));
            });
    };

    const handleClose = async () => {
        try {
            await schema.validate(investor, { abortEarly: false });
        } catch (err) {
            const pathToMessage = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setInvestorError(pathToMessage);
            return;
        }
        onSave(investor);
    };

    const handleCancel = () => {
        setInvestor({ name: '', email: '', amount_invested: '' });
        setInvestorError({ name: false, email: false, amount_invested: false });
        onHide();
    };

    useEffect(() => {
        if (!defaultData)
            setInvestor({});
        else
            setInvestor(defaultData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const investorDialogFooter = (
        <React.Fragment>
            <Flex justifyContent='flex-end'>
                <Button label="Cancel" icon="pi pi-times" onClick={handleCancel} />
                <Button label="Save" icon="pi pi-check" onClick={handleClose} />
            </Flex>
        </React.Fragment>
    );
    const billTypeOptions = [
        { label: 'Upfront fees', value: 'Upfront fees' },
        { label: 'Yearly fees', value: 'Yearly fees' }
    ];

    return (
        <Dialog visible={visible} style={{ width: '32rem' }} header="Add Investor" modal className="p-fluid" footer={investorDialogFooter} onHide={onHide}>
            <Input error={investorError.name} onChange={(value) => handleInput('name', value)} value={investor.name} placeholder='Name' />
            <Input error={investorError.email} onChange={(value) => handleInput('email', value)} value={investor.email} placeholder='Email' />
            <Input error={investorError.amount_invested} onChange={(value) => handleInput('amount_invested', value)} value={investor.amount_invested} placeholder='Amount Invested' type='number' />
            <Dropdown error={investorError.billing_type} options={billTypeOptions} onChange={(value) => handleInput('billing_type', value)} value={investor.billing_type} placeholder='Select a billing method' />
        </Dialog>
    );
}

export default AddInvestorDialog;
