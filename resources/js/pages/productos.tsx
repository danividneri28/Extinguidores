import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import ProductFormModal from "@/components/ProductFormModal";
import CategoryFormModal from "@/components/CategoryFormModal";
import AppLayout from "@/layouts/app-layout";
import { Toaster, toast } from "sonner";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export default function Productos() {
    const { products, categorias } = usePage<{
        products: { id: number; nombre: string; codigo_barras: string; descripcion: string; precio: number; categoria_id: number; categoria?: { nombre: string } }[]
        categorias: { id: number; nombre: string }[]
    }>().props;

    const [isModalOpenProducts, setIsModalOpenProducts] = useState(false);
    const [isModalOpenCategories, setIsModalOpenCategories] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const openModalProducts = (product = null) => {
        setSelectedProduct(product);
        setIsModalOpenProducts(true);
    };

    const openModalCategories = (categoria = null) => {
        setSelectedCategory(categoria);
        setIsModalOpenCategories(true);
    };

    const handleDelete = (id: Number) => {
        router.delete(`/products/${id}`, {
            onSuccess: () => {
                toast.success("Producto eliminado");
                router.reload();
            },
            onError: () => {
                toast.error("Error deleting post");
                console.error("Error deleting post");
            }
        });
    };

    const columns = [
        { field: 'nombre', headerName: 'Producto', flex: 1 },
        { field: 'codigo_barras', headerName: 'Código de Barras', flex: 1 },
        { field: 'categoria', headerName: 'Categoría', flex: 1 },
        { field: 'descripcion', headerName: 'Descripción', flex: 2 },
        { field: 'precio', headerName: 'Precio', flex: 1, type: 'number' },
        {
            field: 'actions',
            headerName: 'Acciones',
            sortable: false,
            renderCell: (params) => (
                <div className="flex justify-center items-center gap-2 py-2">
                    <button onClick={() => openModalProducts(params.row)} className="bg-blue-600 text-white rounded px-3 py-1 text-sm hover:bg-blue-700 transition">Editar</button>
                    <button onClick={() => handleDelete(params.row.id)} className="bg-red-600 text-white rounded px-3 py-1 text-sm hover:bg-red-700 transition">Eliminar</button>
                </div>
            ),
            width: 180,
        },
    ];

    const rows = products.map((product) => ({
        id: product.id,
        nombre: product.nombre,
        codigo_barras: product.codigo_barras,
        categoria: product.categoria?.nombre || "Sin categoría",
        descripcion: product.descripcion,
        precio: product.precio,
    }));

    const isDark = document.documentElement.classList.contains('dark');

    const muiTheme = createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
        },
    });

    return (
        <AppLayout>
            <Head title="Productos" />
            <Toaster position="top-right" richColors />
            <div className="flex flex-col gap-6 p-6 m-4 bg-white text-black shadow-lg rounded-xl dark:bg-neutral-900 dark:text-white">
                <div className="flex justify-end gap-4">
                    <button onClick={() => openModalCategories()} className="bg-blue-600 text-white rounded px-3 py-1 text-sm hover:bg-blue-700 transition">
                        + Categoría
                    </button>
                    <button onClick={() => openModalProducts()} className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition">
                        + Producto
                    </button>
                </div>

                <ThemeProvider theme={muiTheme}>
                    <CssBaseline />
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        pagination
                        disableSelectionOnClick
                    />
                </ThemeProvider>

                <ProductFormModal
                    isOpen={isModalOpenProducts}
                    closeModal={() => setIsModalOpenProducts(false)}
                    product={selectedProduct}
                    categorias={categorias}
                />
                <CategoryFormModal
                    isOpen={isModalOpenCategories}
                    closeModal={() => setIsModalOpenCategories(false)}
                    categorias={selectedCategory}
                />
            </div>
        </AppLayout>
    );
}
