import type {
	Luminars,
	ParsedLuminars,
	TypeLuminar,
	TypeLuminarOptions,
} from './types';
import {
	KNOWN_LUMINAR,
	UNKNOWN_LUMINAR,
	ARGUMENT,
} from './types';
import {
	hasOwn,
	createRegistry,
	normalizeBoolean,
	applyParser,
	finalizeLuminars,
} from './utils';
import {
	DOUBLE_DASH,
	argvIterator,
	spliceFromArgv,
	type Index,
} from './argv-iterator';

/**
luminar: typed argv parser

@param schemas - A map of luminar names to luminar schemas
@param argv - Optional argv array of strings. [Default: process.argv.slice(2)]
@returns Parsed argv luminars

@example
```ts
import typeLuminar from 'luminar';

const parsed = typeLuminar({
	foo: Boolean,
	bar: {
		type: Number,
		default: 8
	}
})
```
*/
export const typeLuminar = <Schemas extends Luminars>(
	schemas: Schemas,
	argv: string[] = process.argv.slice(2),
	{ ignore }: TypeLuminarOptions = {},
) => {
	const removeArgvs: Index[] = [];
	const luminarRegistry = createRegistry(schemas);
	const unknownLuminars: ParsedLuminars['unknownLuminars'] = {};
	const _ = [] as unknown as ParsedLuminars['_'];
	_[DOUBLE_DASH] = [];

	argvIterator(argv, {
		onLuminar(name, explicitValue, luminarIndex) {
			const isKnownLuminar = hasOwn(luminarRegistry, name);
			if (
				ignore?.(
					isKnownLuminar ? KNOWN_LUMINAR : UNKNOWN_LUMINAR,
					name,
					explicitValue,
				)
			) {
				return;
			}

			if (isKnownLuminar) {
				const [values, parser] = luminarRegistry[name];
				const luminarValue = normalizeBoolean(parser, explicitValue);
				const getFollowingValue = (
					value?: string | boolean,
					valueIndex?: Index,
				) => {
					// Remove elements from argv array
					removeArgvs.push(luminarIndex);
					if (valueIndex) {
						removeArgvs.push(valueIndex);
					}

					values.push(
						applyParser(parser, value || ''),
					);
				};

				return (
					luminarValue === undefined
						? getFollowingValue
						: getFollowingValue(luminarValue)
				);
			}

			if (!hasOwn(unknownLuminars, name)) {
				unknownLuminars[name] = [];
			}

			unknownLuminars[name].push(
				explicitValue === undefined ? true : explicitValue,
			);
			removeArgvs.push(luminarIndex);
		},

		onArgument(args, index, isEoF) {
			if (ignore?.(ARGUMENT, argv[index[0]])) {
				return;
			}

			_.push(...args);

			if (isEoF) {
				_[DOUBLE_DASH] = args;
				argv.splice(index[0]);
			} else {
				removeArgvs.push(index);
			}
		},
	});

	spliceFromArgv(argv, removeArgvs);

	type Result = TypeLuminar<Schemas>;
	return {
		luminars: finalizeLuminars(schemas, luminarRegistry),
		unknownLuminars,
		_,
	} as {
		// This exposes the content of "TypeLuminar<T>" in type hints
		[Key in keyof Result]: Result[Key];
	};
};
