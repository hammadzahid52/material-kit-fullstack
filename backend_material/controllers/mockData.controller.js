
const pool = require('../db'); 

// CREATE operation
const createItem = async (req, res) => {
    try {
        const { first_name, last_name, email, gender, ip_address } = req.body;
        const newItem = await pool.query(
            "INSERT INTO MOCK_DATA (first_name, last_name, email, gender, ip_address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [first_name, last_name, email, gender, ip_address]
        );
        return res.status(200).json({message: "Item created successfully", result : newItem.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};



// READ operation 
const viewItem = async (req, res) => {
    try {
        const { id } = req.body;
        const item = await pool.query("SELECT * FROM MOCK_DATA WHERE id = $1", [id]);
        if (item.rows.length === 0) {
            return res.status(404).json({ message: "Item not found", result: null});
        }
        return res.status(200).json({message: "Success", result : item});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({message: "Server Error", result : null});
    }
};

// view selected records
const selctedrecords = async (req, res) => {
    try {
        const { page, limit } = req.query;
        // console.log(req.body, "req.body");
        const offset = (page - 1) * limit;
        const allItems = await pool.query("SELECT * FROM MOCK_DATA LIMIT $1 OFFSET $2", [limit, offset]);
        const totalRows = await pool.query("SELECT COUNT(*) FROM MOCK_DATA");        
        allItems.totalRows = totalRows.rows[0].count;
        
        return res.status(200).json({ message: "Success", result: allItems });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Server Error", result: null });
    }
};



// READ operation 
const viewAllItems = async (req, res) => {
    try {
        const allItems = await pool.query("SELECT * FROM MOCK_DATA");

        return res.status(200).json({message: "Success", result : allItems});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({message: "Server Error", result : null});
    }
};

// UPDATE operation
const updateItem = async (req, res) => {
    try {
        const {id, first_name, last_name, email, gender, ip_address } = req.body;
        
        const updatedItem = await pool.query(
            "UPDATE MOCK_DATA SET first_name = $1, last_name = $2, email = $3, gender = $4, ip_address = $5 WHERE id = $6 RETURNING *",
            [first_name, last_name, email, gender, ip_address, id]
        );
        return res.status(200).json({ message: "Item updated successfully", result: updatedItem });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Server Error", result: null});
    }
};


// DELETE operation
const deleteItem = async (req, res) => {
    try {
        const { id } = req.body;
        const item = await pool.query("DELETE FROM MOCK_DATA WHERE id = $1", [id]);
        return res.status(200).json({ message: "Item deleted successfully", result: item});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Server Error", result: null});
    }
};

const deleteMultipleItems = async (req, res) => {
    try {
        const { ids } = req.body;
        const item = await pool.query("DELETE FROM MOCK_DATA WHERE id = ANY($1)", [ids]);
        return res.status(200).json({ message: "Items deleted successfully", result: item});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Server Error", result: null});
    }
}


module.exports = {
    createItem,
    viewItem,
    viewAllItems,
    updateItem,
    deleteItem,
    deleteMultipleItems,
    selctedrecords
};
