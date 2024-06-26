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

    const [capitalCall, setCapitalCall] = useState(defaultData || { investor: '', total_amount: '', due_date: '', from_company: '',iban:""});
    const [capitalCallError, setCapitalCallError] = useState({ investor: false, total_amount: false, due_date: false, from_company: false,iban:false});

    let schema = yup.object().shape({
        investor: yup.string().required('Please select an investor'),
        total_amount: yup.number().required('Please enter the total amount').positive('Total amount must be positive'),
        due_date: yup.date().required('Please enter the due date'),
        from_company: yup.string().required('Please enter the company name'),
        iban: yup.string().required('Please enter the IBAN').matches(/^AL\d{10}[0-9A-Z]{16}$|^AD\d{10}[0-9A-Z]{12}$|^AT\d{18}$|^BH\d{2}[A-Z]{4}[0-9A-Z]{14}$|^BE\d{14}$|^BA\d{18}$|^BG\d{2}[A-Z]{4}\d{6}[0-9A-Z]{8}$|^HR\d{19}$|^CY\d{10}[0-9A-Z]{16}$|^CZ\d{22}$|^DK\d{16}$|^FO\d{16}$|^GL\d{16}$|^DO\d{2}[0-9A-Z]{4}\d{20}$|^EE\d{18}$|^FI\d{16}$|^FR\d{12}[0-9A-Z]{11}\d{2}$|^GE\d{2}[A-Z]{2}\d{16}$|^DE\d{20}$|^GI\d{2}[A-Z]{4}[0-9A-Z]{15}$|^GR\d{9}[0-9A-Z]{16}$|^HU\d{26}$|^IS\d{24}$|^IE\d{2}[A-Z]{4}\d{14}$|^IL\d{21}$|^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^[A-Z]{2}\d{5}[0-9A-Z]{13}$|^KW\d{2}[A-Z]{4}22!$|^LV\d{2}[A-Z]{4}[0-9A-Z]{13}$|^LB\d{6}[0-9A-Z]{20}$|^LI\d{7}[0-9A-Z]{12}$|^LT\d{18}$|^LU\d{5}[0-9A-Z]{13}$|^MK\d{5}[0-9A-Z]{10}\d{2}$|^MT\d{2}[A-Z]{4}\d{5}[0-9A-Z]{18}$|^MR13\d{23}$|^MU\d{2}[A-Z]{4}\d{19}[A-Z]{3}$|^MC\d{12}[0-9A-Z]{11}\d{2}$|^ME\d{20}$|^NL\d{2}[A-Z]{4}\d{10}$|^NO\d{13}$|^PL\d{10}[0-9A-Z]{,16}n$|^PT\d{23}$|^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$|^SM\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^SA\d{4}[0-9A-Z]{18}$|^RS\d{20}$|^SK\d{22}$|^SI\d{17}$|^ES\d{22}$|^SE\d{22}$|^CH\d{7}[0-9A-Z]{12}$|^TN59\d{20}$|^TR\d{7}[0-9A-Z]{17}$|^AE\d{21}$|^GB\d{2}[A-Z]{4}\d{14}$/, 'Invalid IBAN format')
    });

    const handleInput = async (attribute, value) => {
        setCapitalCall(capitalCall => ({ ...capitalCall, [attribute]: value }));
        schema.validateAt(attribute, { [attribute]: value })
            .then(() => {
                setCapitalCallError(capitalCallError => ({ ...capitalCallError, [attribute]: '' }));
            })
            .catch(err => {
                setCapitalCallError(capitalCallError => ({ ...capitalCallError, [err.path]: err.message }));
            });
    };

    const handleClose = async () => {
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
            <Input error={capitalCallError.iban} onChange={(value) => handleInput('iban', value)} value={capitalCall.iban} placeholder='IBAN' />

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
