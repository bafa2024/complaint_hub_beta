// src/components/admin/AdminBrands.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        // Adjust the URL to match your backend route
        const response = await apiClient.get('/admin/brands');
        setBrands(response.data);
      } catch (err) {
        console.error('Error loading brands:', err);
        setError('Failed to load brands.');
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  if (loading) return <div>Loading brands...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Brand Management</h2>
      {brands.length === 0 ? (
        <p>No brands found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>ID</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td style={{ padding: '0.5rem 0' }}>{brand.id}</td>
                <td style={{ padding: '0.5rem 0' }}>{brand.name}</td>
                <td style={{ padding: '0.5rem 0' }}>
                  {/* TODO: wire up these actions */}
                  <button onClick={() => /* edit logic */ null}>Edit</button>{' '}
                  <button onClick={() => /* delete logic */ null}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
