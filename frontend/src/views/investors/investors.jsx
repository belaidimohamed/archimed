import { Button } from 'primereact/button'
import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../components/navigation/navbar'
import AddInvestorDialog from './components/addInvestor'
import { createInvestor, deleteInvestor, getInvestors, updateInvestor } from '../../services/api'
import { Toast } from 'primereact/toast';
import InvestorsTable from './components/investorsTable'
import Flex from '../../components/containers/flex'
import { Container } from '../../components/containers/container'
import Spinner from '../../components/containers/spinner'

export default function Investors() {
  const [defaultInvestor, setDefaultInvestor] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [investors, setInvestors] = useState([])
  const [investorDialog, setInvestorDialog] = useState(false)
  const toast = useRef(null);

  const onCreateInvestor = async (data) => {
    console.log(data)
    setInvestorDialog(false)
    createInvestor(data).then(() => {
      fetchInvestors()
    }).catch((error) => {
      console.log(error.message)
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
    })
  }
  const fetchInvestors = () => {
    getInvestors().then((resp) => {
      setInvestors(resp.data)
      setIsLoading(false)
    }).catch(() => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while retrieving the investors' });
      setIsLoading(false)
    })
  }
  useEffect(() => {
    console.log('hi')
    fetchInvestors()
  }, [])
  
  const handleEdit = (data) => {
    console.log(data)
    setInvestorDialog(true);
    setDefaultInvestor({...data})
  }
  const handleDelete = (data) => {
    deleteInvestor(data.id).then(()=>{
      fetchInvestors();
      toast.current.show({ severity: 'info', summary: 'Info', detail: 'Investor deleted succefully' });
    }).catch((error) => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the investor' });
    })
  }
  const onUpdateInvestor = (data) => {
    setInvestorDialog(false)
    updateInvestor(data.id , data).then(resp=> {
      fetchInvestors()
      toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Investor updated succefully' });
    }).catch((err) => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occured while updating the investor' });
    })
    setDefaultInvestor({})
  }
  return (
    <div>
      <Navbar />
      {isLoading ? <Spinner />:
          <Container>
            <Flex justifyContent='flex-end'>
              <Button className='mb-5' label="Add an investor" severity='success' onClick={()=>setInvestorDialog(true)} />
            </Flex>
            <InvestorsTable handleEdit={handleEdit} handleDelete={handleDelete} data={investors} />
            <AddInvestorDialog
              defaultData={defaultInvestor}
              onSave={(data)=>{defaultInvestor? onUpdateInvestor(data): onCreateInvestor(data)} }
              onHide={() => { setInvestorDialog(false) }}
              visible={investorDialog} />
          </Container>
      }
      <Toast ref={toast} />
    </div>
  )
}
