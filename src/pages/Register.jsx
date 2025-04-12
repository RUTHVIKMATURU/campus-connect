import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate
function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate(); // Initialize navigate

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPass) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        regNo: data.regNo,
        year: data.year,
        branch: data.branch,
        password: data.password,
      });
      console.log(res.data.message);
      navigate('/login');
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Failed to register';
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 px-4 text-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-cyan-700">Register</h2>

        {errors.root && <p className="text-red-600 text-sm text-center">{errors.root.message}</p>}

        <div>
          <label className="block mb-1 font-medium">Registration Number</label>
          <input
            type="text"
            {...register('regNo', { required: 'Registration number is required' })}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="eg: 2X071AXXXX"
          />
          {errors.regNo && <p className="text-red-600 text-sm">{errors.regNo.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Year</label>
          <select
            {...register('year', { required: 'Year is required' })}
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="">Select Year</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>
          {errors.year && <p className="text-red-600 text-sm">{errors.year.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Branch</label>
          <select
            {...register('branch', { required: 'Branch is required' })}
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="CSE-AIML">CSE-AIML</option>
            <option value="CSE-DS">CSE-DS</option>
            <option value="CSBS">CSBS</option>
            <option value="AIDS">AIDS</option>
            <option value="CSE-IOT">CSE-IOT</option>
            <option value="CSE-CYS">CSE-CYS</option>
            <option value="EIE">EIE</option>
            <option value="AME">AME</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="IT">IT</option>
          </select>
          {errors.branch && <p className="text-red-600 text-sm">{errors.branch.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Enter password"
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPass', { required: 'Confirm your password' })}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Confirm password"
          />
          {errors.confirmPass && (
            <p className="text-red-600 text-sm">{errors.confirmPass.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-medium"
        >
          Register
        </button>
        <Link
          to="/admin-login"
          className="block text-center text-cyan-700 hover:text-cyan-900 font-medium transition-colors duration-200"
        >
          Admin Login
        </Link>

      </form>
    </div>
  );
}

export default Register;
