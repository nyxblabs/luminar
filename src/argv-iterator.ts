export const DOUBLE_DASH = '--';

export type Index =
	| [index: number]
	| [index: number, aliasIndex: number, isLast: boolean];

type onValueCallbackType = (
	value?: string,
	index?: Index,
) => void;

type onLuminar = (
	name: string,
	value: string | undefined,
	index: Index,
) => void | onValueCallbackType;

type onArgument = (
	args: string[],
	index: Index,
	isEoF?: boolean,
) => void;

const valueDelimiterPattern = /[.:=]/;

const isLuminarPattern = /^-{1,2}\w/;

export const parseLuminarArgv = (
	luminarArgv: string,
): [
	luminarName: string,
	luminarValue: string | undefined,
	isAlias: boolean,
] | undefined => {
	if (!isLuminarPattern.test(luminarArgv)) {
		return;
	}

	const isAlias = !luminarArgv.startsWith(DOUBLE_DASH);
	let luminarName = luminarArgv.slice(isAlias ? 1 : 2);
	let luminarValue;

	const hasValueDalimiter = luminarName.match(valueDelimiterPattern);
	if (hasValueDalimiter) {
		const { index } = hasValueDalimiter;
		luminarValue = luminarName.slice(index! + 1);
		luminarName = luminarName.slice(0, index);
	}

	return [luminarName, luminarValue, isAlias];
};

export const argvIterator = (
	argv: string[],
	{
		onLuminar,
		onArgument,
	}: {
			onLuminar?: onLuminar;
		onArgument?: onArgument;
	},
) => {
	let onValueCallback: void | onValueCallbackType;
	const triggerValueCallback = (
		value?: string,
		index?: Index,
	) => {
		if (typeof onValueCallback !== 'function') {
			return true;
		}

		onValueCallback(value, index);
		onValueCallback = undefined;
	};

	for (let i = 0; i < argv.length; i += 1) {
		const argvElement = argv[i];

		if (argvElement === DOUBLE_DASH) {
			triggerValueCallback();

			const remaining = argv.slice(i + 1);
			onArgument?.(remaining, [i], true);
			break;
		}

		const parsedLuminar = parseLuminarArgv(argvElement);

		if (parsedLuminar) {
			triggerValueCallback();

			if (!onLuminar) {
				continue;
			}

			const [luminarName, luminarValue, isAlias] = parsedLuminar;

			if (isAlias) {
				// Alias group
				for (let j = 0; j < luminarName.length; j += 1) {
					triggerValueCallback();

					const isLastAlias = j === luminarName.length - 1;
					onValueCallback = onLuminar(
						luminarName[j],
						isLastAlias ? luminarValue : undefined,
						[i, j + 1, isLastAlias],
					);
				}
			} else {
				onValueCallback = onLuminar(
					luminarName,
					luminarValue,
					[i],
				);
			}
		} else if (triggerValueCallback(argvElement, [i])) { // if no callback was set
			onArgument?.([argvElement], [i]);
		}
	}

	triggerValueCallback();
};

export const spliceFromArgv = (
	argv: string[],
	removeArgvs: Index[],
) => {
	for (const [index, aliasIndex, isLast] of removeArgvs.reverse()) {
		if (aliasIndex) {
			const element = argv[index];
			let newValue = element.slice(0, aliasIndex);
			if (!isLast) {
				newValue += element.slice(aliasIndex + 1);
			}

			if (newValue !== '-') {
				argv[index] = newValue;
				continue;
			}
		}

		argv.splice(index, 1);
	}
};
