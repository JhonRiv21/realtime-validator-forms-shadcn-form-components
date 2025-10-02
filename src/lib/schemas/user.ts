import { z } from 'zod';

export const userFormSchema = z
	.object({
		username: z
			.string()
			.min(2, 'El nombre de usuario debe tener al menos 2 caracteres')
			.max(50, 'El nombre de usuario no puede exceder 50 caracteres'),
		email: z
			.string()
			.email('Debe ser un correo electrónico válido')
			.max(100, 'El correo electrónico no puede exceder 100 caracteres'),
		country: z.string().min(1, 'Debes seleccionar un país'),
		experience: z.string().min(1, 'Debes seleccionar tu nivel de experiencia'),
		message: z
			.string()
			.min(10, 'El mensaje debe tener al menos 10 caracteres')
			.max(500, 'El mensaje no puede exceder 500 caracteres'),
		password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
		confirmPassword: z
			.string()
			.min(8, 'La confirmación de contraseña debe tener al menos 8 caracteres'),
		terms: z.boolean().refine((val) => val, {
			message: 'Debes aceptar los términos y condiciones'
		})
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['confirmPassword']
	});
