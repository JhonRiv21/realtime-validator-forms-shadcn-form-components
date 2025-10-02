import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userFormSchema } from '$lib/schemas/user';

export const actions = {
	default: async ({ request }) => {
		console.log('🚀 Acción del servidor iniciada');

		// Obtener los datos del formulario
		const formData = await request.formData();
		console.log('📝 Datos del formulario recibidos:', Object.fromEntries(formData));

		// Validar con superforms
		const form = await superValidate(formData, zod(userFormSchema));

		console.log('✅ Validación completada');
		console.log('📊 Resultado de validación:', {
			valid: form.valid,
			data: form.data,
			errors: form.errors
		});

		if (!form.valid) {
			console.log('❌ Formulario inválido, devolviendo errores');
			return fail(400, { form });
		}

		// Simular procesamiento de datos
		console.log('🔄 Procesando datos del usuario...');
		console.log('👤 Usuario:', form.data.username);
		console.log('📧 Email:', form.data.email);
		console.log('🌍 País:', form.data.country);
		console.log('💼 Experiencia:', form.data.experience);
		console.log('💬 Mensaje:', form.data.message);
		console.log('🔒 Contraseña (hash simulado):', '*'.repeat(form.data.password.length));
		console.log('✅ Términos aceptados:', form.data.terms);

		// Simular delay de procesamiento
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log('🎉 Usuario registrado exitosamente');

		return {
			form, // Devolver el form limpio para evitar el "flash"
			success: true,
			message: 'Usuario registrado exitosamente'
		};
	}
};
