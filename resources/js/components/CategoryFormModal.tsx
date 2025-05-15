import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Categoria {
    id?: number;
    nombre: string;
}

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    categorias?: Categoria | null;
}

export default function CategoryFormModal({ isOpen, closeModal, categorias }: Props) {
    const [formData, setFormData] = useState<Categoria>({
        nombre: "",
    });

    useEffect(() => {
        if (categorias) {
            setFormData({
                nombre: categorias.nombre,
            });
        } else {
            setFormData({
                nombre: "",
            });
        }
    }, [categorias]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "precio" || name === "categoria_id" ? Number(value) : value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        data.append("nombre", formData.nombre);

        router.post("/categories", data, {
            onSuccess: () => {
                toast.success("Categoria creada");
                closeModal();
            },
            onError: () => {
                toast.error("Error al crear la categoria");
            }
        });

    };

    if(!isOpen) return null;
    const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
   return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto dark:bg-neutral-900/50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md dark:bg-neutral-800">
                <h2 className="text-xl font-semibold mb-4">{categorias ? "Editar Categoria" : "Agregar Categoria"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                            className={inputStyle} placeholder="Nombre" />
                    </div>
                    <div className="flex justify-between gap-2">
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                            {categorias ? "Actualizar" : "Crear"}
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
