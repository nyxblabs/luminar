import type {
	TypeFunction,
	LuminarTypeOrSchema,
	Luminars,
} from './types';

const { stringify } = JSON;
const camelCasePattern = /\B([A-Z])/g;
const camelToKebab = (string: string) => string.replace(camelCasePattern, '-$1').toLowerCase();

const { hasOwnProperty } = Object.prototype;
export const hasOwn = (object: any, property: PropertyKey) => hasOwnProperty.call(object, property);

/**
 * Default Array.isArray doesn't support type-narrowing
 * on readonly arrays.
 *
 * https://stackoverflow.com/a/56249765/911407
 */
const isReadonlyArray = (
	array: readonly any[] | any,
): array is readonly unknown[] => Array.isArray(array);

export const parseLuminarType = (
	luminarSchema: LuminarTypeOrSchema,
): [parser: TypeFunction, isArray: boolean] => {
	if (typeof luminarSchema === 'function') {
		return [luminarSchema, false];
	}

	if (isReadonlyArray(luminarSchema)) {
		return [luminarSchema[0], true];
	}

	return parseLuminarType(luminarSchema.type);
};

export const normalizeBoolean = <T>(
	parser: TypeFunction,
	value: T,
) => {
	if (parser === Boolean) {
		return value !== 'false';
	}

	return value;
};

export const applyParser = (
	typeFunction: TypeFunction,
	value: any,
) => {
	if (typeof value === 'boolean') {
		return value;
	}

	if (typeFunction === Number && value === '') {
		return Number.NaN;
	}

	return typeFunction(value);
};

const reservedCharactersPattern = /[\s.:=]/;

const validateLuminarName = (
	luminarName: string,
) => {
	const errorPrefix = `Luminar name ${stringify(luminarName)}`;

	if (luminarName.length === 0) {
		throw new Error(`${errorPrefix} cannot be empty`);
	}

	if (luminarName.length === 1) {
		throw new Error(`${errorPrefix} must be longer than a character`);
	}

	const hasReservedCharacter = luminarName.match(reservedCharactersPattern);
	if (hasReservedCharacter) {
		throw new Error(`${errorPrefix} cannot contain ${stringify(hasReservedCharacter?.[0])}`);
	}
};

type LuminarParsingData = [
	values: unknown[],
	parser: TypeFunction,
	isArray: boolean,
	schema: LuminarTypeOrSchema,
];

type LuminarRegistry = {
	[luminarName: string]: LuminarParsingData;
};

export const createRegistry = (
	schemas: Luminars,
) => {
	const registry: LuminarRegistry = {};

	const setLuminar = (
		luminarName: string,
		data: LuminarParsingData,
	) => {
		if (hasOwn(registry, luminarName)) {
			throw new Error(`Duplicate luminars named ${stringify(luminarName)}`);
		}

		registry[luminarName] = data;
	};

	for (const luminarName in schemas) {
		if (!hasOwn(schemas, luminarName)) {
			continue;
		}
		validateLuminarName(luminarName);

		const schema = schemas[luminarName];
		const luminarData: LuminarParsingData = [
			[],
			...parseLuminarType(schema),
			schema,
		];

		setLuminar(luminarName, luminarData);

		const kebabCasing = camelToKebab(luminarName);
		if (luminarName !== kebabCasing) {
			setLuminar(kebabCasing, luminarData);
		}

		if ('alias' in schema && typeof schema.alias === 'string') {
			const { alias } = schema;
			const errorPrefix = `Luminar alias ${stringify(alias)} for luminar ${stringify(luminarName)}`;

			if (alias.length === 0) {
				throw new Error(`${errorPrefix} cannot be empty`);
			}

			if (alias.length > 1) {
				throw new Error(`${errorPrefix} must be a single character`);
			}

			setLuminar(alias, luminarData);
		}
	}

	return registry;
};

export const finalizeLuminars = (
	schemas: Luminars,
	registry: LuminarRegistry,
) => {
	const luminars: Record<string, unknown> = {};

	for (const luminarName in schemas) {
		if (!hasOwn(schemas, luminarName)) {
			continue;
		}

		const [values, , isArray, schema] = registry[luminarName];
		if (
			values.length === 0
			&& 'default' in schema
		) {
			let { default: defaultValue } = schema;
			if (typeof defaultValue === 'function') {
				defaultValue = defaultValue();
			}
			luminars[luminarName] = defaultValue;
		} else {
			luminars[luminarName] = isArray ? values : values.pop();
		}
	}

	return luminars;
};
