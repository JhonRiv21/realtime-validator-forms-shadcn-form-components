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
		displayLimit?: number;
		searchPlaceholder?: string;
	}

	let {
		options = [],
		value = $bindable(''),
		placeholder = 'Selecciona una opción...',
		disabled = false,
		onValueChange,
		class: className,
		'aria-invalid': ariaInvalid = false,
		displayLimit = 100,
		searchPlaceholder = 'Buscar...',
		...restProps
	}: Props = $props();

	const { name: fieldName, ...buttonProps } = restProps as unknown as {
		name?: string;
		id?: string;
		[key: string]: unknown;
	};

	const isInvalid = $derived(ariaInvalid === true || ariaInvalid === 'true');

	let open = $state(false);
	let mounted = $state(false);
	let searchTerm = $state('');

	onMount(() => {
		mounted = true;
	});

	const selectedOption = $derived(options.find((option) => option.value === value));

	const filteredOptions = $derived(
		!searchTerm.trim()
			? options.slice(0, displayLimit)
			: options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const displayInfo = $derived(
		searchTerm.trim()
			? `Mostrando ${filteredOptions.length} de ${options.length} opciones`
			: `Mostrando ${filteredOptions.length} de ${options.length} opciones. Escribe para buscar en todas las opciones.`
	);

	function handleSelect(optionValue: string) {
		if (disabled) return;
		value = optionValue;
		open = false;
		searchTerm = '';
		onValueChange?.(optionValue);
	}

	function handleOpenChange(newOpen: boolean) {
		if (disabled) return;
		open = newOpen;
		if (!newOpen) {
			searchTerm = '';
		}
	}
</script>

{#if mounted}
	<div class="w-full">
		<Popover bind:open onOpenChange={handleOpenChange}>
			<input type="hidden" name={fieldName} {value} autocomplete="off" />
			<PopoverTrigger class="w-full" {disabled}>
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
			<PopoverContent class="p-0">
				<Command shouldFilter={false}>
					<CommandInput placeholder={searchPlaceholder} bind:value={searchTerm} />
					<CommandList>
						<CommandEmpty>No se encontraron opciones.</CommandEmpty>
						<CommandGroup class="!max-h-[200px] overflow-y-auto">
							{#each filteredOptions as option (option.value)}
								<CommandItem
									value={option.label}
									onSelect={() => handleSelect(option.value)}
									class="cursor-pointer"
								>
									<Check
										class={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')}
									/>
									{option.label}
								</CommandItem>
							{/each}
						</CommandGroup>
						{#if options.length > 0}
							<div class="border-t px-3 py-1.5 text-xs text-muted-foreground">
								{displayInfo}
							</div>
						{/if}
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
			<span class="min-w-0 flex-1 truncate font-normal text-[#555555]/80">Cargando...</span>
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</div>
{/if}
