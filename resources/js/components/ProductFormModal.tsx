import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Product {
    id?: number;
    nombre: string;
    codigo_barras: string;
    descripcion: string;
    precio: number;
    categoria_id: number;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    product?: Product | null;
    categorias: Categoria[];
}

export default function ProductFormModal({ isOpen, closeModal, product, categorias }: Props) {
    const [formData, setFormData] = useState<Product>({
        nombre: "",
        codigo_barras: "",
        descripcion: "",
        precio: 0,
        categoria_id: 0,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                nombre: product.nombre,
                codigo_barras: product.codigo_barras,
                descripcion: product.descripcion,
                precio: product.precio,
                categoria_id: product.categoria_id,
            });
        } else {
            setFormData({
                nombre: "",
                codigo_barras: "",
                descripcion: "",
                precio: 0,
                categoria_id: 0,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]:
            name === "precio"
                ? parseFloat(value)
                : name === "categoria_id"
                    ? value === "" ? 0 : parseInt(value)
                    : value,
    });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();

        data.append("nombre", formData.nombre);
        data.append("codigo_barras", formData.codigo_barras);
        data.append("descripcion", formData.descripcion);
        data.append("precio", formData.precio.toString());
        data.append("categoria_id", formData.categoria_id.toString());

        if (product?.id) {
            data.append("_method", "PUT");
            router.put(`/products/${product.id}`, data, {
                onSuccess: () => {
                    closeModal();
                    toast.success("Producto actualizado");
                    router.reload();
                },
                onError: () => {
                    toast.error("Error al actualizar el producto");
                }
            });
        } else {
            router.post("/products", data, {
                onSuccess: () => {
                    toast.success("Producto creado");
                    closeModal();
                },
                onError: () => {
                    toast.error("Error al crear el producto");
                }
            });
        }
    };

    if(!isOpen) return null;
    const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
   return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto dark:bg-neutral-900/50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md dark:bg-neutral-800">
                <h2 className="text-xl font-semibold mb-4">{product ? "Editar Producto" : "Agregar Producto"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                            className={inputStyle} placeholder="Nombre" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="codigo_barras" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Código de Barras</label>
                        <input type="text" name="codigo_barras" value={formData.codigo_barras} onChange={handleChange} required
                            className={inputStyle} placeholder="Código de Barras" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="categoria_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoría</label>
                        <select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required
                            className={inputStyle}>
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}
                            className={inputStyle} placeholder="Descripción" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="precio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                        <input type="number" name="precio" value={formData.precio} onChange={handleChange} required
                            className={inputStyle} placeholder="Precio" />
                    </div>
                    <div className="flex justify-between gap-2">
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                            {product ? "Actualizar" : "Crear"}
                        </button>
                        <button type="button" onClick={closeModal} className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
