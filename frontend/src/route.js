import { createBrowserRouter } from "react-router-dom";
import CapitalCalls from './views/capitalCalls/capitalCalls';
import Bills from './views/bills/bills';
import Investors from './views/investors/investors';


export const router = createBrowserRouter([
  { path: '/investors', element: <Investors /> },
    {path:'*',element:<Investors />},

  {path:'/capitalCalls',element:<CapitalCalls />},
  { path: '/bills', element: <Bills /> },
  
])
