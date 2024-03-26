import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Dropdown from '../../../components/form/dropdown'; // Assuming you have a Dropdown component
import Flex from '../../../components/containers/flex';
import Input from '../../../components/form/input';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';

function AddCapitalCallDialog({ visible, onHide, onSave, defaultData = {}, investors }) {
    const navigate = useNavigate();

    const [capitalCall, setCapitalCall] = useState(defaultData || { investor: '', total_amount: '', due_date: '', from_company: ''});
    const [capitalCallError, setCapitalCallError] = useState({ investor: false, total_amount: false, due_date: false, from_company: false});

    let schema = yup.object().shape({
        investor: yup.string().required('Please select an investor'),
        total_amount: yup.number().required('Please enter the total amount').positive('Total amount must be positive'),
        due_date: yup.date().required('Please enter the due date'),
        from_company: yup.string().required('Please enter the company name'),
    });

    const handleInput = async (attribute, value) => {
        setCapitalCall(capitalCall => ({ ...capitalCall, [attribute]: value }));
        schema.validateAt(attribute, { [attribute]: value })
            .then(resp => {
                setCapitalCallError(capitalCallError => ({ ...capitalCallError, [attribute]: '' }));
            })
            .catch(err => {
                setCapitalCallError(capitalCallError => ({ ...capitalCallError, [err.path]: err.message }));
            });
    };

    const handleClose = async () => {
        console.log(capitalCall)
        try {
            await schema.validate(capitalCall, { abortEarly: false });
        } catch (err) {
            const pathToMessage = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setCapitalCallError(pathToMessage);
            return;
        }
        onSave(capitalCall);
    };

    const handleCancel = () => {
        setCapitalCall({ investor: '', total_amount: '', due_date: '', from_company: '', to_person: '', email: '', status: 'VALIDATED' });
        setCapitalCallError({ investor: false, total_amount: false, due_date: false, from_company: false, to_person: false, email: false });
        onHide();
    };

    const goInvestors = () => {
        navigate('/investors');
    };

    useEffect(() => {
        if (!defaultData)
            setCapitalCall({});
        else
            setCapitalCall(defaultData);
    }, [visible]);

    const capitalCallDialogFooter = (
        <React.Fragment>
            <Flex justifyContent='flex-end'>
                <Button label="Cancel" icon="pi pi-times" onClick={handleCancel} />
                <Button label="Save" icon="pi pi-check" onClick={handleClose} />
            </Flex>
        </React.Fragment>
    );
      const mapInvestors = (data) => {
        const array = []
        data.forEach((item)=> {
            array.push({label:item.email+' - '+item.amount_invested, value:item.id})
        })
        return array
    }

    return (
        <Dialog visible={visible} style={{ width: '32rem' }} header="Add Capital Call" modal className="p-fluid" footer={capitalCallDialogFooter} onHide={onHide}>
            <Dropdown error={capitalCallError.investor} options={mapInvestors(investors)} onChange={(value) => handleInput('investor', value)} value={capitalCall.investor} placeholder='Select Investor' />
            <Input error={capitalCallError.total_amount} onChange={(value) => handleInput('total_amount', value)} value={capitalCall.total_amount} placeholder='Total Amount' type='number' />
            <Input error={capitalCallError.due_date} onChange={(value) => handleInput('due_date', value)} value={capitalCall.due_date} placeholder='Due Date' type='date' />
            <Input error={capitalCallError.from_company} onChange={(value) => handleInput('from_company', value)} value={capitalCall.from_company} placeholder='From Company' />
            {/* <Input error={capitalCallError.to_person} onChange={(value) => handleInput('to_person', value)} value={capitalCall.to_person} placeholder='To Person' />
            <Input error={capitalCallError.email} onChange={(value) => handleInput('email', value)} value={capitalCall.email} placeholder='Email' /> */}
            {/* Assuming you have a dropdown component for status */}
            {/* <Dropdown error={capitalCallError.status} options={['VALIDATED', 'SENT', 'PAID', 'OVERDUE']} onChange={(value) => handleInput('status', value)} value={capitalCall.status} placeholder='Select Status' /> */}
            <br />
            <hr />
            <br />
            <div>Don't have an investor? <a onClick={goInvestors} href='#AddInvestor'>Click here to add a new one</a></div>
        </Dialog>
    );
}

export default AddCapitalCallDialog;
