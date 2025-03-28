import { useState, useEffect } from "react";
import './index.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'tailwindcss/tailwind.css';
import CountdownTimer from './CountdownTimer';
import './uwmstyle.css';
function Register() {



  useState(() => {
    document.title = "Register";
  }, []);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [alumni, setAlumni] = useState(false);
  const [year, setYear] = useState("");
  const [degree, setDegree] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (last_name) {
      setPassword(last_name.toLowerCase().replace(/\s/g, '') + "2025");

    }
  }, [last_name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          title,
          company,
          alumni,
          year,
          degree,
          email,
          password,
        }),
      });
      // if response is 201 (created), redirect to confirmation page
      // else, display error message
      if (response.status === 201) {
        window.location.href = "/confirmation";
        setLoading(false);
      }
      else {
        const data = await response.json();
        console.log(data);
        // company: ['This field may not be blank.']
        // title: ['This field may not be blank.']
        // error will be in the above form 
        // so we need to extract the error message from the error object
        // and display it on the page
        // set the p tag with id error to the as empty string
        const p = document.getElementById("error");
        p.innerHTML = "";
        for (const key in data.errors) {
          // we have a p tag with id error in the html
          // we need to set the innerHTML of that p tag to the error message
          // we can do this using the DOM API
          // create a new ol element and append it to the p tag
          // create a new li element and append it to the ol element
          // set the innerHTML of the li element to the error message
          const p = document.getElementById("error");
          const ul = document.createElement("ul");
          const li = document.createElement("li");
          li.innerHTML = "<b>" + key.toUpperCase() + "</b>: " + data.errors[key];
          // make li  a color red
          li.style.color = "red";
          ul.appendChild(li);
          p.appendChild(ul);
        }
        setLoading(false);
      }
    }
    catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleAlumniChange = (e) => {
    setAlumni(e.target.checked);
    setShowFields(e.target.checked);
  };

  return (
    <>
      <CountdownTimer targetDate={new Date('2023-04-22T09:00:00-05:00')} />
      <div className="min-h-screen bg-gradient-to-r from-ffbd00 to-[#eca600] flex items-center justify-center pt-12 pb-8">
        <div className="bg-white shadow-md rounded-lg p-8  w-full md:w-96 lg:w-1/2 mx-4 md:mx-0">
          <br />
          <Form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-1xl font-bold text-center">Judge Registration</h1>
            <h5 className="text-sm text-gray-600 text-center">Judging will be in-person using your personal device.</h5>
            <div className="space-y-2">
              <label htmlFor="first_name" className="block text-xl font-semibold">
                First Name*
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                placeholder="Enter your first name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="last_name" className="block text-xl font-semibold">
                Last Name*
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                placeholder="Enter your last name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="block text-xl font-semibold">
                Title*
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter your title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="block text-xl font-semibold">
                Company*
              </label>
              <input
                type="text"
                name="company"
                id="company"
                placeholder="Enter your company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <Form.Group controlId="formBasicAlumni" className="mb-3">
  <Form.Check
    type="checkbox"
    label={
      <span className="uwm-alumni-label">
        {"Check this box if you're an alumnus of the College of Engineering & Applied Science*"
          .split(" ")
          .map((word, i) => (
            <span key={i} className="uwm-animated-word" style={{ animationDelay: `${i * 0.2}s` }}>
              {word}&nbsp;
            </span>
          ))}
      </span>
    }
    value={alumni}
    checked={alumni}
    onChange={handleAlumniChange}
  />
</Form.Group>


            {showFields && (
              <>

                <div className="space-y-2">
                  <label htmlFor="year" className="block text-xl font-semibold">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    id="year"
                    placeholder="If yes, what year?"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}

                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="degree" className="block text-xl font-semibold">
                    Degree
                  </label>
                  <input

                    type="text"
                    name="degree"
                    id="degree"
                    placeholder="If yes, what degree?"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}
            <div id="note" style={{ color: "red" }}>
              <h5>Important:</h5>
              <ul>
                <li>Your password will be automatically assigned and populated into the field below.</li> <br />
                <li>Your password will be your last name, followed by 2025. If your last name is Smith, your password will be smith2025.</li> <br />
                <li>On the day of the event, you will login using the email you are providing now and the automatically provided password.</li> <br />
              </ul>
            </div>
            <div id="mobile" style={{ color: "red" }}>
              <p>Important:</p>
              <ul>
                <li>Your password will be automatically assigned and populated into the field below.</li> <br />
                <li>Your password will be your last name, followed by 2025. If your last name is Smith, your password will be Smith2025.</li> <br />
                <li>On the day of the event, you will login using the email you are providing now and the automatically provided password.</li> <br />
              </ul>
            </div>


            <div className="space-y-2">
              <label htmlFor="email" className="block text-xl font-semibold">
                Email*
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>


            <Form.Group controlId="formBasicPassword" className="mb-3">
              <label htmlFor="password" className="block text-xl font-semibold">
                Password*
              </label>
              <br />
              {last_name ? (
                <Form.Control
                  type="text"
                  placeholder="Your password will be your Last Name followed by 2025"
                  value={last_name.toLowerCase().replace(/\s/g, '') + "2025"} onChange={(e) => setPassword(e.target.value)} disabled />
              ) : (
                <Form.Control
                  type="text"
                  placeholder="Your password will be your Last Name followed by 2025"
                  value={password} onChange={(e) => setPassword(e.target.value)} disabled />
              )
              }
            </Form.Group>
            <button
              className={`w-full p-2 text-white font-bold rounded ${loading ? 'bg-gray-500' : 'bg-green-500'
                }`}
              id="Register-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </>
              ) : (
                'Register'
              )}
            </button>
          </Form>
          <p id="error">
          </p>
        </div>
      </div>
      <br />
    </>
  );
}

export default Register;
