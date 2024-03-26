import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/navigation/navbar';
import AddBillDialog from './components/addBill';
import { createBill, deleteBill, generateBills, getBills, getInvestors, updateBill } from '../../services/api';
import { Toast } from 'primereact/toast';
import BillsTable from './components/billsTable';
import Flex from '../../components/containers/flex';
import { Container } from '../../components/containers/container';
import Spinner from '../../components/containers/spinner';

export default function Bills() {
  const [defaultBill, setDefaultBill] = useState();
  const [bills, setBills] = useState([]);
  const [billDialog, setBillDialog] = useState(false);
  const [investors, setInvestors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const toast = useRef(null);

  const fetchInvestors = () => {
    getInvestors().then((resp) => {
      setInvestors(resp.data)
    }).catch(() => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while retrieving the investors' });
    })
  }
  const onCreateBill = async (data) => {
    setBillDialog(false);
    createBill(data)
      .then(() => {
        fetchBills();
      })
      .catch((error) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
      });
  };

  const fetchBills = () => {
    getBills()
      .then((resp) => {
        setBills(resp.data);
        setIsLoading(false)

      })
      .catch(() => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while retrieving the bills' });
        setIsLoading(false)
      });
  };

  const handleEdit = (data) => {
    setBillDialog(true);
    setDefaultBill({ ...data });
  };

  const handleDelete = (data) => {
    deleteBill(data.id)
      .then(() => {
        fetchBills();
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Bill deleted successfully' });
      })
      .catch((error) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the bill' });
      });
  };

  const onUpdateBill = (data) => {
    setBillDialog(false);
    updateBill(data.id, data)
      .then((resp) => {
        fetchBills();
        toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Bill updated successfully' });
      })
      .catch((err) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the bill' });
      });
    setDefaultBill({});
  };
  const onGenerateBills = () => {
    setIsGenerating(true)
    generateBills().then((data) => {
      fetchBills();
      setIsGenerating(false)
    }).catch((err) => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while generating bills' });
    });
  }
  useEffect(() => {
      fetchBills();
      fetchInvestors()
  }, [])
  return (
    <div>
      <Navbar />
      {isLoading ? <Spinner /> :
        <Container>
          <Flex justifyContent='flex-end'>
            {/* <Button className='mb-5' disabled={isGenerating} label="Add a bill" severity='success' onClick={() => setBillDialog(true)} /> */}
            <Button className='mb-5' disabled={isGenerating} label={isGenerating? "Generating..":"Generate bills"} severity='info' onClick={onGenerateBills} />

          </Flex>
          <BillsTable handleEdit={handleEdit} handleDelete={handleDelete} data={bills} />
          <AddBillDialog
            investors={investors}
            defaultData={defaultBill}
            onSave={(data) => { defaultBill ? onUpdateBill(data) : onCreateBill(data); }}
            onHide={() => { setBillDialog(false); }}
            visible={billDialog}
          />
        </Container>
      }
      <Toast ref={toast} />
    </div>
  );
}
