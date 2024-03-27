import { RouterProvider } from 'react-router-dom';
import './App.css';
import {router} from './route'
function App() {
  console.warn = () => {}; // Disable all warnings
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
