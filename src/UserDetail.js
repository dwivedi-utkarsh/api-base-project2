import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './UserDetails.css';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get('https://d2k-static-assets.s3.ap-south-1.amazonaws.com/assignment-files/python-backend-assignment/users.json')
      .then(res => {
        const userData = res.data.find(user => user.id === parseInt(id));
        setUser(userData || {});
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div className="user-detail-wrapper">
      <div className="back-link-container">
        <Link to="/">Back</Link>
      </div>
      {user && user.first_name ? (
        <>
          <h1>Details: {user.first_name} {user.last_name}</h1>
          <div className="user-detail-container">
            <div className="user-detail-row">
              <span>First Name:</span>
              <div>{user.first_name}</div>
            </div>
            <div className="user-detail-row">
              <span>Last Name:</span>
              <div>{user.last_name}</div>
            </div>
            <div className="user-detail-row">
              <span>Age:</span>
              <div>{user.age}</div>
            </div>
            <div className="user-detail-row">
              <span>Email:</span>
              <div>{user.email}</div>
            </div>
            <div className="user-detail-row">
              <span>Website:</span>
              <div>{user.web}</div>
            </div>
            <div className="user-detail-row">
              <span>Company Name:</span>
              <div>{user.company_name}</div>
            </div>
            <div className="user-detail-row">
              <span>City:</span>
              <div>{user.city}</div>
            </div>
            <div className="user-detail-row">
              <span>State:</span>
              <div>{user.state}</div>
            </div>
            <div className="user-detail-row">
              <span>ZIP:</span>
              <div>{user.zip}</div>
            </div>
          </div>
        </>
      ) : (
        <p>User data not available.</p>
      )}
    </div>
  );
};

export default UserDetail;
