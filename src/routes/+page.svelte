<script lang="ts">
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { userFormSchema } from '$lib/schemas/user';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Combobox } from '$lib/components/ui/combobox/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group/index';
	import { options } from './option';

	let loading = $state(false);

	
	const experienceOptions = [
		{ value: 'beginner', label: 'Principiante (0-2 años)' },
		{ value: 'intermediate', label: 'Intermedio (3-5 años)' },
		{ value: 'advanced', label: 'Avanzado (6-10 años)' },
		{ value: 'expert', label: 'Experto (10+ años)' }
	];

	const form = superForm(defaults(zod(userFormSchema)), {
		validators: zod(userFormSchema),
		resetForm: true,
		onResult: ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				toast.success(`Usuario registrado exitosamente`);
			} else if (result.type === 'failure') {
				if (result.data?.error) {
					toast.error(result.data.error);
				} else {
					toast.error('Error al procesar el formulario.');
				}
			}
		},
		onError: ({ result }) => {
			loading = false;
			if (result.error) {
				let errorMessage = 'Error al procesar el formulario.';
				if (typeof result.error === 'string') {
					errorMessage = result.error;
				} else if (result.error && typeof result.error === 'object' && 'message' in result.error) {
					errorMessage = result.error.message;
				}
				toast.error(errorMessage);
			} else {
				toast.error('Error al procesar el formulario.');
			}
		}
	});

	const { form: formData, enhance } = form;
	
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-3 py-12 sm:px-6 lg:px-8"
>
	<div class="w-full max-w-md rounded-lg bg-white p-4 shadow-2xl sm:p-8">
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Registro de Usuario</h1>
			<p class="text-gray-600">Crea tu cuenta en nuestro sistema</p>
		</div>

		<form method="POST" class="space-y-5" use:enhance onsubmit={() => (loading = true)}>
			<Form.Field {form} name="username">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nombre de Usuario</Form.Label>
						<Input
							{...props}
							bind:value={$formData.username}
							placeholder="Ingresa tu nombre de usuario"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Correo Electrónico</Form.Label>
						<Input
							{...props}
							bind:value={$formData.email}
							type="email"
							placeholder="tu@email.com"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="country">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>País</Form.Label>
						<Combobox
							{options}
							bind:value={$formData.country}
							placeholder="Selecciona tu país"
							{...props}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="experience">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nivel de Experiencia</Form.Label>
						<RadioGroup bind:value={$formData.experience} {...props}>
							{#each experienceOptions as option}
								<div class="flex items-center space-x-2">
									<RadioGroupItem value={option.value} id={option.value} />
									<label for={option.value} class="text-sm font-normal cursor-pointer">
										{option.label}
									</label>
								</div>
							{/each}
						</RadioGroup>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="message">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Mensaje</Form.Label>
						<Textarea
							bind:value={$formData.message}
							placeholder="Cuéntanos sobre ti y tus objetivos..."
							rows={4}
							{...props}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Contraseña</Form.Label>
						<Input
							{...props}
							type="password"
							autocomplete="new-password"
							bind:value={$formData.password}
							placeholder="Mínimo 8 caracteres"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirmar Contraseña</Form.Label>
						<Input
							{...props}
							type="password"
							bind:value={$formData.confirmPassword}
							placeholder="Confirma tu contraseña"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="terms">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center space-x-2">
							<Checkbox {...props} bind:checked={$formData.terms} id="terms" />
							<label for="terms" class="text-sm font-normal cursor-pointer">
								Acepto los términos y condiciones
							</label>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="w-full" disabled={loading}>
				{#if loading}
					<div class="flex items-center justify-center">
						<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
					</div>
				{:else}
					Registrar Usuario
				{/if}
			</Form.Button>
		</form>
	</div>
</div>
