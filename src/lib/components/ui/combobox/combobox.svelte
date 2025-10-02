<script lang="ts">
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList
	} from '$lib/components/ui/command';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Check, ChevronsUpDown } from '@lucide/svelte/icons';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		options: Option[];
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		onValueChange?: (value: string) => void;
		class?: string;
		'aria-invalid'?: boolean | string;
	}

	let {
		options = [],
		value = $bindable(''),
		placeholder = 'Selecciona una opción...',
		disabled = false,
		onValueChange,
		class: className,
		'aria-invalid': ariaInvalid = false,
		...restProps
	}: Props = $props();

	// Extraer name/id para usarlos en un input oculto y evitar que vayan al botón
	// Mantener el resto de props (incluyendo aria-*) para el botón/trigger
	const { name: fieldName, id: fieldId, ...buttonProps } = restProps as unknown as {
		name?: string;
		id?: string;
		[key: string]: unknown;
	};

	const isInvalid = $derived(ariaInvalid === true || ariaInvalid === 'true');

	let open = $state(false);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const selectedOption = $derived(options.find((option) => option.value === value));

	function handleSelect(optionValue: string) {
		if (disabled) return;
		value = optionValue;
		open = false;
		onValueChange?.(optionValue);
	}

	function handleOpenChange(newOpen: boolean) {
		if (disabled) return;
		open = newOpen;
	}
</script>

{#if mounted}
	<div class="w-full">
		<Popover bind:open onOpenChange={handleOpenChange}>
			<!-- Asegurar que el valor se envíe con el formulario -->
			<input type="hidden" name={fieldName} value={value} />
			<PopoverTrigger class="w-full">
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-invalid={isInvalid}
					class={cn(
						'w-full justify-between text-left',
						'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
						isInvalid && 'border-destructive ring-destructive/20 dark:ring-destructive/40',
						className
					)}
					{disabled}
					{...buttonProps}
				>
					<span
						class="min-w-0 flex-1 truncate font-normal {selectedOption
							? 'text-black'
							: 'text-[#555555]/80'}"
					>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent class="!w-auto p-0">
				<Command>
					<CommandInput placeholder="Buscar..." />
					<CommandList>
						<CommandEmpty>No se encontraron opciones.</CommandEmpty>
						<CommandGroup>
							{#each options as option (option.value)}
								<CommandItem value={option.label} onSelect={() => handleSelect(option.value)}>
									<Check
										class={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')}
									/>
									{option.label}
								</CommandItem>
							{/each}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	</div>
{:else}
	<div class="w-full">
		<Button
			variant="outline"
			aria-invalid={isInvalid}
			class={cn(
				'w-full justify-between text-left',
				'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
				isInvalid && 'border-destructive ring-destructive/20 dark:ring-destructive/40',
				className
			)}
			{disabled}
			{...buttonProps}
		>
			<span class="min-w-0 flex-1 truncate font-normal text-[#555555]/80"> Cargando... </span>
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</div>
{/if}
