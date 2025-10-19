import Contact from "../models/Contact.js";

// ✅ Create new contact
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !message || !service) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = await Contact.create({ name, email, phone, service, message });
    res.status(201).json({ message: "Message received successfully!", contact: newContact });
  } catch (err) {
    res.status(500).json({ message: "Error saving contact", error: err.message });
  }
};

// ✅ Get all contacts (Admin only)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ message: "Contacts fetched successfully", result: contacts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contacts", error: err.message });
  }
};

// ✅ Delete contact
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting contact", error: err.message });
  }
};
