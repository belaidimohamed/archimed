import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Container } from '../../components/containers/container'
import Navbar from '../../components/navigation/navbar'
import AddCapitalCallDialog from './components/addCapitalCalls'

export default function CapitalCalls() {
  const [investors, setInvestors] = useState([])
  const [investorDialog, setInvestorDialog] = useState(false)

  return (
    <div>
      <Navbar />
      <Container>
        <Button label="Add an investor" severity='success' onClick={()=>setInvestorDialog(true)} />
        
        <AddCapitalCallDialog onHide={()=>{setInvestorDialog(false)}} visible={investorDialog} />
      </Container>
    </div>
  )
}
