const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support large base64 images
app.use(express.static(__dirname)); // Serve static files like index.html and assets

const productsFile = path.join(__dirname, 'products.json');

// Get all products
app.get('/api/products', (req, res) => {
    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products:', err);
            return res.status(500).json({ error: 'Failed to read products' });
        }
        res.json(JSON.parse(data));
    });
});

// Add a new product
app.post('/api/products', (req, res) => {
    const { name, price, image } = req.body;
    
    if (!name || !price || !image) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read database' });
        
        const products = JSON.parse(data);
        const newProduct = {
            id: Date.now(),
            name,
            price: Number(price),
            image
        };
        
        products.push(newProduct);
        
        fs.writeFile(productsFile, JSON.stringify(products, null, 4), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save product' });
            res.status(201).json(newProduct);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
