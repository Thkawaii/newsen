import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home"; // นำเข้าหน้า Home
import MapComponent from "./pages/startbooking/MapComponent";
import MapDestination from "./pages/MapDestination/MapDestination";
import MapRoute from "./pages/MapRoute/MapRoute";
import RideHistory from "./pages/RideHistory/RideHistory";
//import PassengerChat from "./pages/chat/PassengerChat";
//import DriverChat from "./pages/chat/DriverChat";
import PromotionCreate from "./pages/promotion/create";
import PromotionEdit from "./pages/promotion/edit";
import Promotion from "./pages/promotion";
import PromotionView from "./pages/promotion/view";
import DriverWithWithdrawal from "./pages/withdrawal";
import WithdrawalCreate from "./pages/withdrawal/money";
import Statement from "./pages/withdrawal/statement";
import HomePayment from "./pages/payment/paid/Home";
import Review from "./pages/review/review";
import Payment from "./pages/payment/payment";
import History from "./pages/review/review_history/history";
import Edit from "./pages/review/edit/edit";
import AdminRoom from "./pages/room/AdminRoom.tsx";
import DriverRoom from "./pages/room/DriverRoom";
import CreateRoom from "./pages/room/create";
import EditRoom from "./pages/room/edit";
import Trainbook from "./pages/room/trainbook/TrainBook";
import Trainer from "./pages/trainer/Trainer";
import CreateTrainer from "./pages/trainer/create";
import EditTrainer from './pages/trainer/edit';
import Login from "./pages/login/login";
import Driver from "./pages/Driver/Driver";
import Employee from "./pages/Employee/Employee";
import EditEmployee from "./pages/Employee/EditEmployee";
import AddEmployee from "./pages/Employee/AddEmployee";
import Vehicle from "./pages/Vehicle/Vehicle";
import DriverBooking from "./pages/DriverBooking/DriverBooking";
import PassengerNotification from "./pages/passengerbooking/passengerbooking";
import DriverChat from "./pages/chat/DriverChat";
import PassengerChatPage from "./pages/chat/PassengerChat";
import PassengerProfile from "./pages/historypassenger/passengerprofile";
import PreBooking from "./pages/prebooking/prebooking";
import AddDriver from "./pages/Driver/Adddriver";
import Passenger from "./pages/Passenger/Passenger";
import Dashboard from "./pages/Dashboard/Admindashboard";
import Dashboards from "./pages/Dashboard/Driverdashboard";
import FinishJob from "./pages/finishjob/finishjob";
import DriverTrackingPage from "./pages/DriverBooking/DriverBooking";
import Driverontheway from "./pages/DriverBooking/DriverBooking";
import DriverFinish from "./pages/DriverBooking/DriverBooking";
import Training from "./pages/training/Training.tsx";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>

      <Route path="/" element={<Login />} />


      {/* ของเปิ้ล Booking and Chat */}
        <Route path="/home" element={<Home />} /> {/* เส้นทางสำหรับหน้า Home */}
        <Route path="/map" element={<MapComponent />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/mapdestination" element={<MapDestination />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/maproute" element={<MapRoute />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/RideHistory" element={<RideHistory />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        
        <Route path="/DriverBooking" element={<DriverBooking />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/PassengerNotification" element={<PassengerNotification />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/DriverChat" element={<DriverChat />} />
        <Route path="/PassengerChat" element={<PassengerChatPage />} />
        <Route path="/Passengerprofile" element={<PassengerProfile />} />
        
        <Route path="/Prebooking" element={<PreBooking />} />
        <Route path="/Finishjob" element={<FinishJob/>} />
        <Route path="/DriverTrackingPage" element={<DriverTrackingPage/>} />



       {/*ต้อง* promotion */}
       <Route path="/promotion" element={< Promotion />} />
        <Route path="/promotion/create" element={< PromotionCreate />} />
        <Route path="/promotion/edit/:id" element={< PromotionEdit />} />
        <Route path="/promotion/view" element={< PromotionView />} />
        <Route path="/withdrawal" element={< DriverWithWithdrawal />} />
        <Route path="/withdrawal/money" element={< WithdrawalCreate />} />
        <Route path="/withdrawal/statement" element={< Statement />} />

        {/*ฟร้อง Payment and Review */}
        <Route path="/paid/:id" element={< HomePayment />} /> 
        <Route path="/review" element={<Review/>} /> 
        <Route path="/payment" element={<Payment/>} /> 
        <Route path="/review/history" element={<History/>} /> 
        <Route path="/edit" element={<Edit/>} /> 

        {/*นนท์ Room and Trainer แก้*/}
        <Route path="/rooms" element={<AdminRoom />} />
        <Route path="/room" element={<DriverRoom />} />
        <Route path="/rooms/create" element={<CreateRoom />} />
        <Route path="/rooms/edit/:id" element={<EditRoom />} />
        <Route path="/trainbook/:id" element={<Trainbook />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/trainer/create" element={<CreateTrainer />} />
        <Route path="/trainer/edit/:id" element={<EditTrainer />} />
        <Route path="/training" element={<Training />} />

        {/*น้ำฝน Admin*/}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Dashboards" element={<Dashboards />} />
        <Route path="/Driverontheway" element={<Driverontheway />} />
        <Route path="/DriverFinish" element={<DriverFinish />} />
        <Route path="/Drivers" element={<Driver />} />
        <Route path="/Driver/create" element={<AddDriver />} />
        <Route path="/Members" element={<Passenger />} />
        <Route path="/Employees" element={<Employee />} />
        <Route path="/Employee/create" element={<AddEmployee />} />
        <Route path="/Employee/edit" element={<EditEmployee />} />
        <Route path="/Vehicles" element={<Vehicle />} />

      </Routes>
    </Router>
  );
};

export default App;
