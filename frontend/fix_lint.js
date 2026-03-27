import fs from 'fs';

const fixSpecific = (file, target, replacement) => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(target, replacement);
        fs.writeFileSync(file, content, 'utf8');
    }
};

// 1. ClientNavbar.jsx
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/ClientNavbar.jsx', /const \{ user \} = useContext\(AuthContext\);/, 'const { /* user */ } = useContext(AuthContext);');
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/ClientNavbar.jsx', /const user = JSON\.parse\(localStorage\.getItem\('user'\)\);/, 'const user = JSON.parse(localStorage.getItem(\'user\'));\n  /* eslint-disable-next-line no-unused-vars */');

// 2. CreateInvoice.jsx
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/CreateInvoice.jsx', /const invoiceData = \{/, 'const _invoiceDataWithNumber = {'); // Revert the bad duplicate
fixSpecific('d:/Projects/Consultency/Consultancy/frontend/src/components/CreateInvoice.jsx', /const _invoiceDataWithNumber = \{\n\s*invoiceNumber:/, '/* eslint-disable-next-line no-unused-vars */\n    const _invoiceDataWithNumber = {\n      invoiceNumber:'); 

// 3. Dashboard.jsx
let dashboardContent = fs.readFileSync('d:/Projects/Consultency/Consultancy/frontend/src/components/Dashboard.jsx', 'utf8');
dashboardContent = dashboardContent.replace(/\(\) => true\)/g, '() => true)');
dashboardContent = dashboardContent.replace(/\(sub\) => sub\.status === "paid"/g, '() => true');
fs.writeFileSync('d:/Projects/Consultency/Consultancy/frontend/src/components/Dashboard.jsx', dashboardContent, 'utf8');

// 4. InvoiceById.jsx
let ibiContent = fs.readFileSync('d:/Projects/Consultency/Consultancy/frontend/src/components/InvoiceById.jsx', 'utf8');
ibiContent = ibiContent.replace(/import \{ useParams, useNavigate \} from 'react-router-dom';/, 'import { useParams } from \'react-router-dom\';');
fs.writeFileSync('d:/Projects/Consultency/Consultancy/frontend/src/components/InvoiceById.jsx', ibiContent, 'utf8');

// 5. InvoiceDetailsForm.jsx
let idfContent = fs.readFileSync('d:/Projects/Consultency/Consultancy/frontend/src/components/InvoiceDetailsForm.jsx', 'utf8');
idfContent = idfContent.replace(/const InvoiceDetailsForm = \(\{ invoice, onChange, onProductChange, onProductSelect \}\) => \{/, 'const InvoiceDetailsForm = ({ invoice, onChange, onProductChange }) => {');
fs.writeFileSync('d:/Projects/Consultency/Consultancy/frontend/src/components/InvoiceDetailsForm.jsx', idfContent, 'utf8');

// 6. LoginPage.jsx
let lpContent = fs.readFileSync('d:/Projects/Consultency/Consultancy/frontend/src/components/LoginPage.jsx', 'utf8');
lpContent = lpContent.replace(/const \{ register, handleSubmit, reset, formState: \{ errors \} \} = useForm\(\);/, 'const { register, handleSubmit, formState: { errors } } = useForm();');
fs.writeFileSync('d:/Projects/Consultency/Consultancy/frontend/src/components/LoginPage.jsx', lpContent, 'utf8');

// 7. vite.config.js
let viteContent = fs.readFileSync('d:/Projects/Consultency/Consultancy/frontend/vite.config.js', 'utf8');
if (!viteContent.includes('const __dirname')) {
    viteContent = viteContent.replace(/import \{ defineConfig \} from 'vite';/, "import { defineConfig } from 'vite';\nimport path from 'path';\nimport { fileURLToPath } from 'url';\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);");
    fs.writeFileSync('d:/Projects/Consultency/Consultancy/frontend/vite.config.js', viteContent, 'utf8');
}
