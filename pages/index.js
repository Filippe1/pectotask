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

  const handleEditClick = (id, wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang) => {
    setEditingId(id);
    setEditedRow({ wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang });
  };

  const handleInputChange = (field, value) => {
    setEditedRow({ ...editedRow, [field]: value });
  };

  const handleSaveClick = async (id) => {
    const response = await fetch('/api/rustofin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editedRow }),
    });

    if (response.ok) {
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
      setSuccessMessage('Changes saved successfully!');

      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      console.error('Failed to save changes.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    setFilteredData(
      data.filter((item) =>
        item.wordFirstLang.toLowerCase().includes(term) ||
        item.sentenceFirstLang.toLowerCase().includes(term) ||
        item.wordSecondLang.toLowerCase().includes(term) ||
        item.sentenceSecondLang.toLowerCase().includes(term)
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
            <th>Word (First Lang)</th>
            <th>Sentence (First Lang)</th>
            <th>Word (Second Lang)</th>
            <th>Sentence (Second Lang)</th>
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
                    value={editedRow.wordFirstLang}
                    onChange={(e) => handleInputChange('wordFirstLang', e.target.value)}
                    style={{
                      width: '280px',   // Increase the width of the input box
                      height: '30px',   // Increase the height of the input box
                      padding: '5px',   // Add some padding to the input box for better visibility
                      fontSize: '16px', // Make the font size larger
                      border: '1px solid #ccc', // Add a border for clarity
                      borderRadius: '4px' // Optional: rounding corners
                    }}
                  />
                ) : (
                  item.wordFirstLang
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedRow.sentenceFirstLang}
                    onChange={(e) => handleInputChange('sentenceFirstLang', e.target.value)}
                    style={{
                      width: '450px',   // Increase the width of the input box
                      height: '30px',   // Increase the height of the input box
                      padding: '5px',   // Add some padding to the input box for better visibility
                      fontSize: '16px', // Make the font size larger
                      border: '1px solid #ccc', // Add a border for clarity
                      borderRadius: '4px' // Optional: rounding corners
                    }}
                  />
                ) : (
                  item.sentenceFirstLang
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedRow.wordSecondLang}
                    onChange={(e) => handleInputChange('wordSecondLang', e.target.value)}
                    style={{
                      width: '300px',   // Increase the width of the input box
                      height: '30px',   // Increase the height of the input box
                      padding: '5px',   // Add some padding to the input box for better visibility
                      fontSize: '16px', // Make the font size larger
                      border: '1px solid #ccc', // Add a border for clarity
                      borderRadius: '4px' // Optional: rounding corners
                    }}
                  />
                ) : (
                  item.wordSecondLang
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedRow.sentenceSecondLang}
                    onChange={(e) => handleInputChange('sentenceSecondLang', e.target.value)}
                    style={{
                      width: '450px',   // Increase the width of the input box
                      height: '30px',   // Increase the height of the input box
                      padding: '5px',   // Add some padding to the input box for better visibility
                      fontSize: '16px', // Make the font size larger
                      border: '1px solid #ccc', // Add a border for clarity
                      borderRadius: '4px' // Optional: rounding corners
                    }}
                  />
                ) : (
                  item.sentenceSecondLang
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
                        item.wordFirstLang,
                        item.sentenceFirstLang,
                        item.wordSecondLang,
                        item.sentenceSecondLang
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

