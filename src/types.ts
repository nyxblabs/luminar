import type { DOUBLE_DASH } from './argv-iterator';

export type TypeFunction<ReturnType = any> = (value: any) => ReturnType;

type TypeFunctionArray<ReturnType> = readonly [TypeFunction<ReturnType>];

export type LuminarType<ReturnType = any> = TypeFunction<ReturnType> | TypeFunctionArray<ReturnType>;

type LuminarSchemaBase<TF> = {
	/**
	Type of the luminar as a function that parses the argv string and returns the parsed value.

	@example
	```
	type: String
	```

	@example Wrap in an array to accept multiple values.
	```
	type: [Boolean]
	```

	@example Custom function type that uses moment.js to parse string as date.
	```
	type: function CustomDate(value: string) {
		return moment(value).toDate();
	}
	```
	*/
	type: TF;

	/**
	A single-character alias for the luminar.

	@example
	```
	alias: 's'
	```
	*/
	alias?: string;
} & Record<PropertyKey, unknown>;

type LuminarSchemaDefault<TF, DefaultType = any> = LuminarSchemaBase<TF> & {
	/**
	Default value of the luminar. Also accepts a function that returns the default value.
	[Default: undefined]

	@example
	```
	default: 'hello'
	```

	@example
	```
	default: () => [1, 2, 3]
	```
	*/
	default: DefaultType | (() => DefaultType);
};

export type LuminarSchema<TF = LuminarType> = (
	LuminarSchemaBase<TF>
	| LuminarSchemaDefault<TF>
);

export type LuminarTypeOrSchema<
	ExtraOptions = Record<string, unknown>
	> = LuminarType | (LuminarSchema & ExtraOptions);

export type Luminars<ExtraOptions = Record<string, unknown>> = {
	[luminarName: string]: LuminarTypeOrSchema<ExtraOptions>;
};

export type InferLuminarType<
	Luminar extends LuminarTypeOrSchema
> = (
		Luminar extends (TypeFunctionArray<infer T> | LuminarSchema<TypeFunctionArray<infer T>>)
		? (
			Luminar extends LuminarSchemaDefault<TypeFunctionArray<T>, infer D>
				? T[] | D
				: T[]
		)
		: (
			Luminar extends TypeFunction<infer T> | LuminarSchema<TypeFunction<infer T>>
				? (
				Luminar extends LuminarSchemaDefault<TypeFunction<T>, infer D>
						? T | D
						: T | undefined
				)
				: never
		)
);

export type ParsedLuminars<Schemas = Record<string, unknown>> = {
	luminars: Schemas;
	unknownLuminars: {
		[luminarName: string]: (string | boolean)[];
	};
	_: string[] & {
		[DOUBLE_DASH]: string[];
	};
};

export type TypeLuminar<Schemas extends Luminars> = ParsedLuminars<{
	[luminar in keyof Schemas]: InferLuminarType<Schemas[luminar]>;
}>;

export const KNOWN_LUMINAR = 'known-luminar';
export const UNKNOWN_LUMINAR = 'unknown-luminar';
export const ARGUMENT = 'argument';

type IgnoreFunction = {
	(
		type: typeof ARGUMENT,
		argvElement: string,
	): boolean | void;

	(
		type: typeof KNOWN_LUMINAR | typeof UNKNOWN_LUMINAR,
		luminarName: string,
		luminarValue: string | undefined,
	): boolean | void;
};

export type TypeLuminarOptions = {
	/**
	 * Which argv elements to ignore from parsing
	 */
	ignore?: IgnoreFunction;
};
