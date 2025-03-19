import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await fetchUsers();
      setUsers(users);
    };

    getUsers();
  }, []);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Elenco Utenti</h1>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
            {user.name}
            <Link to={`/user/${user._id}`} className="btn btn-primary btn-sm">
              Visualizza Farmaci
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;