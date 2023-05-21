import type {
	InferLuminarType,
	LuminarType,
} from './types';
import {
	parseLuminarType,
	normalizeBoolean,
	applyParser,
} from './utils';
import {
	argvIterator,
	parseLuminarArgv,
	spliceFromArgv,
	type Index,
} from './argv-iterator';

export const getLuminar = <Type extends LuminarType>(
	luminarNames: string,
	luminarType: Type,
	argv = process.argv.slice(2),
) => {
	// eslint-disable-next-line unicorn/prefer-set-has
	const luminars = luminarNames.split(',').map(name => parseLuminarArgv(name)?.[0]);
	const [parser, gatherAll] = parseLuminarType(luminarType);
	const results: any[] = [];
	const removeArgvs: Index[] = [];

	argvIterator(argv, {
		onLuminar(name, explicitValue, luminarIndex) {
			if (
				!luminars.includes(name)
				|| (!gatherAll && results.length > 0)
			) {
				return;
			}

			const luminarValue = normalizeBoolean(parser, explicitValue);
			const getFollowingValue = (
				implicitValue?: string | boolean,
				valueIndex?: Index,
			) => {
				// Remove elements from argv array
				removeArgvs.push(luminarIndex);
				if (valueIndex) {
					removeArgvs.push(valueIndex);
				}

				results.push(applyParser(parser, implicitValue || ''));
			};

			return (
				luminarValue === undefined
					? getFollowingValue
					: getFollowingValue(luminarValue)
			);
		},
	});

	spliceFromArgv(argv, removeArgvs);

	return (gatherAll ? results : results[0]) as InferLuminarType<Type>;
};
