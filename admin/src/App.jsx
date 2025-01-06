import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/Sidebar/Navbar/Navbar'
import {Routes,Route} from 'react-router-dom'
import Orders from './page/Orders/Orders'
import List from './page/List/List'
import Add from './page/Add/Add'
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        
        <Routes>
          <Route path ="/add" element={<Add/>}/>
          <Route path ="/list" element={<List/>}/>
          <Route path ="/orders" element={<Orders />}/>
        </Routes>

      </div>
    </div>
  )
}

export default App
