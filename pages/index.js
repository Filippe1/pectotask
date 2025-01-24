import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/rustofin');
      const result = await res.json();
      setData(result);
      setFilteredData(result); // Initialize filteredData with the full dataset
    }
    fetchData();
  }, []);

  const handleEditClick = (id, word, translation, example) => {
    setEditingId(id);
    setEditedRow({ word, translation, example });
  };

  const handleInputChange = (field, value) => {
    setEditedRow({ ...editedRow, [field]: value });
  };

  const handleSaveClick = async (id) => {
    // Update entry in the database
    const response = await fetch('/api/rustofin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...editedRow }),
    });

    if (response.ok) {
      // Update the frontend state with new data
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, ...editedRow } : item
        )
      );

      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, ...editedRow } : item
        )
      );

      setEditingId(null); // Exit editing mode
      setSuccessMessage('Changes saved successfully!'); // Set success message

      // Clear the message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      console.error('Failed to save changes.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter the data based on the search term
    setFilteredData(
      data.filter((item) =>
        item.word.toLowerCase().includes(term) ||
        item.translation.toLowerCase().includes(term) ||
        item.example.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rustofin Dictionary</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search words or phrases"
        value={searchTerm}
        onChange={handleSearch}
        style={{
          marginBottom: '20px',
          padding: '10px',
          width: '100%',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />

      {/* Success Message */}
      {successMessage && (
        <div
          style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
          }}
        >
          {successMessage}
        </div>
      )}
      
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Word</th>
            <th>Translation</th>
            <th>Example</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedRow.word}
                    onChange={(e) => handleInputChange('word', e.target.value)}
                  />
                ) : (
                  item.word
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedRow.translation}
                    onChange={(e) => handleInputChange('translation', e.target.value)}
                  />
                ) : (
                  item.translation
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedRow.example}
                    onChange={(e) => handleInputChange('example', e.target.value)}
                  />
                ) : (
                  item.example
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <button onClick={() => handleSaveClick(item.id)}>Save</button>
                ) : (
                  <button
                    onClick={() =>
                      handleEditClick(
                        item.id,
                        item.word,
                        item.translation,
                        item.example
                      )
                    }
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
