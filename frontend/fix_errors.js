import fs from 'fs';

const files = [
  'd:/Projects/Consultency/Consultancy/frontend/src/components/CartDrawer.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/ClientDashboard.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/ClientLogin.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/ClientOrders.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/ClientOverview.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/ClientProducts.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/ClientProfile.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/Clients.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/CreateInvoice.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/Dashboard.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/LoginPage.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/MainLayout.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/Navbar.jsx',
  'd:/Projects/Consultency/Consultancy/frontend/src/components/SignUpPage.jsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import\s*{\s*motion\s*,\s*AnimatePresence\s*}\s*from\s*['"]framer-motion['"];?/g, 'import { AnimatePresence } from "framer-motion";');
    content = content.replace(/import\s*{\s*AnimatePresence\s*,\s*motion\s*}\s*from\s*['"]framer-motion['"];?/g, 'import { AnimatePresence } from "framer-motion";');
    content = content.replace(/import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"];?\s*\n?/g, '');
    fs.writeFileSync(f, content, 'utf8');
  }
});

// Fix specific variables
const fixSpecific = (file, target, replacement) => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(target, replacement);
        fs.writeFileSync(file, content, 'utf8');
    }
};

fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/ClientNavbar.jsx', /const \{ user \} = useContext\(AuthContext\);/g, 'const { /* user */ } = useContext(AuthContext);');
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/CreateInvoice.jsx', /const invoiceDataWithNumber = \{/g, 'const invoiceData = {');
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/Dashboard.jsx', /\(sub\) => sub\.status === "paid"/g, '() => true'); 
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/InvoiceById.jsx', /const navigate = useNavigate\(\);/g, '');
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/InvoiceDetailsForm.jsx', /import React, \{ useState \} from "react";/g, 'import React from "react";');
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/InvoiceDetailsForm.jsx', /const InvoiceDetailsForm = \(\{ invoice, onChange, onProductSelect, onProductChange \}\) => \{/g, 'const InvoiceDetailsForm = ({ invoice, onChange, onProductChange }) => {');
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/LoginPage.jsx', /const \{ register, handleSubmit, reset, formState: \{ errors \} \} = useForm\(\);/g, 'const { register, handleSubmit, formState: { errors } } = useForm();');
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/ProtectedRoute.jsx', /\} catch \(e\) \{/g, '} catch (err) {');
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/ProtectedRoute.jsx', /, \[navigate\]\);/g, ', [navigate, allowedRoles]);');
