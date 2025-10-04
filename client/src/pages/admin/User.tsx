import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

interface OutletContext {
  search: string;
}

export default function User() {
  const { search } = useOutletContext<OutletContext>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(
    u =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.address.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading users...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4 border-b text-gray-700">ID</th>
                <th className="text-left p-4 border-b text-gray-700">First Name</th>
                <th className="text-left p-4 border-b text-gray-700">Last Name</th>
                <th className="text-left p-4 border-b text-gray-700">Email</th>
                <th className="text-left p-4 border-b text-gray-700">Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50`}
                >
                  <td className="p-4 border-b">{user.id}</td>
                  <td className="p-4 border-b">{user.firstName}</td>
                  <td className="p-4 border-b">{user.lastName}</td>
                  <td className="p-4 border-b">{user.email}</td>
                  <td className="p-4 border-b">{user.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
