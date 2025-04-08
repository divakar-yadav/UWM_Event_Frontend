// Import necessary React, Router and component modules
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Component imports
import Login from "./Login";
import Register from "./Register";
import Confirmation from "./Confirmation";
// import StudentJudgedCount from "./StudentJudgedCount";
import Home from "./Home";
import Poster from "./Poster";
// Global CSS import
import "./index.css";
import NotFound from "./404";
import EditRound from "./EditRound";
import Round from "./Round";
import Refresh from './Refresh';
import ExpLearning from "./ExpLearning";
import ThreeMtEdit from "./ThreeMtEdit";
import ExpLearningEdit from "./ExpLearningEdit";
// Bootstrap CSS and JS for styling and interactive components
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
// Navigation bar component
import Navbar from "./Navbar";
import "./index.css";

// PrivateRoute component for protected routes
import PrivateRoute from "./PrivateRoute";
import ThreeMT from "./ThreeMT";
import ServerErrorPage from "./500";
// Main App component which holds the structure of the entire application
function App() {
  // Helper function to concatenate the API URL with a path
  function getApiUrl(path) {
    return `${process.env.REACT_APP_API_URL}${path}`;
  }

  // JSX structure for the App component
  return (
    <>
      {/* Background gradient applied to the whole application */}
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600]">
        <title> SRPC </title>
        <Router>
        <div>
          <Navbar />
        </div>
        <div className="container mx-auto px-4 bg-gradient-to-r from-ffbd00 to-[#eca600]">
        </div>
          <Routes>
            {/* Define the route structure and associate paths with components */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/confirmation" element={<Confirmation />} />
            {/* Private routes require authentication, redirects if not authenticated */}
            <Route path="/judge/research-poster" element={<PrivateRoute><Poster /></PrivateRoute>} />
            <Route path="/judge/exp-learning" element={<PrivateRoute><ExpLearning /></PrivateRoute>} />
            <Route path="/judge/three-mt" element={<PrivateRoute><ThreeMT /></PrivateRoute>} />
            {/* <Route path="/student-judged-count" element={<StudentJudgedCount baseUrl = {process.env.REACT_APP_API_URL}/>} /> */}
            {/* Dynamic routes for different rounds in the application, uses getApiUrl for pre-check */}
            <Route path="/round/1/:posterId" element={<PrivateRoute permissionCheckUrl={getApiUrl("/precheckposter/round1_pre_check/:id")}><Round round={1} /></PrivateRoute>} />
            {/* <Route path="/round/2/:posterId" element={<PrivateRoute permissionCheckUrl={getApiUrl("/precheckposter/round2_pre_check/:id")}><Round round={2} /></PrivateRoute>} /> */}
            <Route path="/editscore/1/research-poster/:posterId" element={<PrivateRoute scoring_type={'research-poster'} permissionCheckUrl={getApiUrl("/precheckposter/round1_pre_check_edit/:id")}><EditRound round={1} /></PrivateRoute>} />
            <Route path="/editscore/threemt/:posterId" element={<PrivateRoute  scoring_type={'threemt'} permissionCheckUrl={getApiUrl("/precheckposter/round1_pre_check_edit/:id")}><ThreeMtEdit round={1} /></PrivateRoute>} />
            <Route path="/editscore/1/explearning/:posterId" element={<PrivateRoute scoring_type={'explearning'}  permissionCheckUrl={getApiUrl("/precheckposter/round1_pre_check_edit/:id")}><ExpLearningEdit round={1} /></PrivateRoute>} />
           
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
      {/* React script inclusion for production build */}
      <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"></script>
    </>
  );
}

export default App;
