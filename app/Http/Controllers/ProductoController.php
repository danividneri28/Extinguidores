<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Response;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $products = Producto::with('categoria')->get();
        $categorias = Categoria::all();
        return inertia('productos', [
            'products' => $products,
            'categorias' => $categorias,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo_barras' => 'required|string|unique:productos,codigo_barras',
            'precio' => 'required|numeric|min:0',
            'categoria_id' => 'required|numeric|exists:categorias,id',
        ]);

        Producto::create($request->all());

        return redirect()->back()->with('success', 'Producto creado con éxito.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $product)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo_barras' => 'required|string|unique:productos,codigo_barras',
            'precio' => 'required|numeric|min:0',
            'categoria_id' => 'required|numeric|exists:categorias,id',
        ]);

        $product->update($request->all());

        return redirect()->back()->with('success', 'Producto actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Producto eliminado con éxito.');
    }
}
