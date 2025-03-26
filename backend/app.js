const express = require('express');
const supabase = require('./config/supabase');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Example route to fetch users
app.get('/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Start server
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
