import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/navigation/navbar';
import AddBillDialog from './components/addBill';
import { createBill, deleteBill, getBills, getInvestors, updateBill } from '../../services/api';
import { Toast } from 'primereact/toast';
import BillsTable from './components/billsTable';
import Flex from '../../components/containers/flex';
import { Container } from '../../components/containers/container';

export default function Bills() {
  const [defaultBill, setDefaultBill] = useState();
  const [bills, setBills] = useState([]);
  const [billDialog, setBillDialog] = useState(false);
  const [investors, setInvestors] = useState([])

  const toast = useRef(null);

  const fetchInvestors = () => {
    getInvestors().then((resp) => {
      setInvestors(resp.data)
    }).catch(() => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while retrieving the investors' });
    })
  }
  const onCreateBill = async (data) => {
    console.log(data);
    setBillDialog(false);
    createBill(data)
      .then(() => {
        fetchBills();
      })
      .catch((error) => {
        console.log(error.message);
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
      });
  };

  const fetchBills = () => {
    getBills()
      .then((resp) => {
        setBills(resp.data);
      })
      .catch(() => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while retrieving the bills' });
      });
  };

  const handleEdit = (data) => {
    console.log(data);
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

  useEffect(() => {
    return () => {
      fetchInvestors()
      fetchBills();
    };
  }, [])
  return (
    <div>
      <Navbar />
      <Container>
        <Flex justifyContent='flex-end'>
          <Button className='mb-5' label="Add a bill" severity='success' onClick={() => setBillDialog(true)} />
        </Flex>
        <BillsTable handleEdit={handleEdit} handleDelete={handleDelete} data={bills} />
        <AddBillDialog
          investors={investors}
          defaultData={defaultBill}
          onSave={(data) => {defaultBill ? onUpdateBill(data) : onCreateBill(data); }}
          onHide={() => {setBillDialog(false);}}
          visible={billDialog}
        />
      </Container>
      <Toast ref={toast} />
    </div>
  );
}
