import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/navigation/navbar';
import AddCapitalCallDialog from './components/addCapitalCall';
import { createCapitalCall, deleteCapitalCall, getCapitalCalls, getInvestors, updateCapitalCall } from '../../services/api';
import { Toast } from 'primereact/toast';
import CapitalCallsTable from './components/capitalCallsTable';
import Flex from '../../components/containers/flex';
import { Container } from '../../components/containers/container';
import Spinner from '../../components/containers/spinner';

export default function CapitalCalls() {
  const [defaultCapitalCall, setDefaultCapitalCall] = useState();
  const [capitalCalls, setCapitalCalls] = useState([]);
  const [capitalCallDialog, setCapitalCallDialog] = useState(false);
  const [investors, setInvestors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useRef(null);

  const onCreateCapitalCall = async (data) => {
    setCapitalCallDialog(false);
    createCapitalCall(data)
      .then(() => {
        fetchCapitalCalls();
      })
      .catch((error) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
      });
  };

  const fetchCapitalCalls = () => {
    getCapitalCalls()
      .then((resp) => {
        setCapitalCalls(resp.data);
        setIsLoading(false)
      })
      .catch(() => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while retrieving the capital calls' });
        setIsLoading(false)
      });
  };

  const handleEdit = (data) => {
    setCapitalCallDialog(true);
    setDefaultCapitalCall({ ...data });
  };

  const handleDelete = (data) => {
    deleteCapitalCall(data.id)
      .then(() => {
        fetchCapitalCalls();
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Capital call deleted successfully' });
      })
      .catch((error) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the capital call' });
      });
  };

  const onUpdateCapitalCall = (data) => {
    setCapitalCallDialog(false);
    updateCapitalCall(data.id, data)
      .then(() => {
        fetchCapitalCalls();
        toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Capital call updated successfully' });
      })
      .catch(() => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the capital call' });
      });
    setDefaultCapitalCall({});
  };
  const fetchInvestors = () => {
    getInvestors().then((resp) => {
      setInvestors(resp.data)
    }).catch(() => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while retrieving the investors' });
    })
  }

  useEffect(() => {
    fetchCapitalCalls();
    fetchInvestors();
  }, []);

  return (
    <div>
      <Navbar />
      {isLoading ? <Spinner /> :
        <Container>
          <Flex justifyContent='flex-end'>
            <Button className='mb-5' label="Add a capital call" severity='success' onClick={() => setCapitalCallDialog(true)} />
          </Flex>
          <CapitalCallsTable handleEdit={handleEdit} handleDelete={handleDelete} data={capitalCalls} />
          <AddCapitalCallDialog
            investors={investors}
            defaultData={defaultCapitalCall}
            onSave={(data) => { defaultCapitalCall ? onUpdateCapitalCall(data) : onCreateCapitalCall(data); }}
            onHide={() => { setCapitalCallDialog(false); }}
            visible={capitalCallDialog}
          />
        </Container>
      }
      <Toast ref={toast} />
    </div>
  );
}
