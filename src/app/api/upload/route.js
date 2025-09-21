// Filepath: src/app/api/upload/route.js
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No se encontró ningún archivo.',
      });
    }

    // Convertir el archivo a un buffer para poder guardarlo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Definir la ruta donde se guardará el archivo
    // process.cwd() es la raíz del proyecto
    const filePath = path.join(process.cwd(), 'public', 'images', file.name);

    // Escribir el archivo en el disco
    await writeFile(filePath, buffer);

    console.log(`Archivo guardado en: ${filePath}`);

    // Devolver la ruta pública para guardarla en la base de datos
    const publicPath = `/images/${file.name}`;
    return NextResponse.json({ success: true, filePath: publicPath });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor.' },
      { status: 500 },
    );
  }
}
