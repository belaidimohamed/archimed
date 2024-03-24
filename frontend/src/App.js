import { RouterProvider, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import {router} from './route'
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
