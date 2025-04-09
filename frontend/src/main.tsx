import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/components/pages/Login';
import FacultyDashboard from './components/pages/FacultyDashboard';
import ProtectedRoute from '../src/components/pages/ProtectedRoute';
import ApplyLeave from './components/pages/ApplyLeave';
import StatusLeave from './components/pages/StatusLeave';
import Attendance from './components/pages/Attendance';
import FacultyForm from './components/pages/AddFaculty';
import StudentForm from './components/pages/AddStudent';
import './index.css';
import AdminDashboard from './components/pages/AdminDashboard';
import SmartAttendance from './components/pages/SmartAttendance';
import LeaveRequests from './components/pages/LeaveRequests';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
	<Route path = "/admin" element={<AdminDashboard/>} />
          <Route path='/smart-dashboard' element={<SmartAttendance />} />
	  <Route path='/leaverequests' element={<LeaveRequests /> } />
	  <Route path='/add-faculty' element={<FacultyForm />} />
	  <Route path='/add-student' element={<StudentForm />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['faculty', 'admin']} />}>
          <Route path='/faculty-dashboard' element={<FacultyDashboard />} />
	  <Route path="/apply-leave" element={<ApplyLeave />} />
	  <Route path="/status-leave" element={<StatusLeave />} />
	  <Route path="/attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
