import {Tooltip} from '@mui/material';
import {JSX, useContext} from 'react';
import { TooltipContext } from '~/contexts/Tooltip.context';

export function TriggerableTooltip({title, children}: { title: string, children: JSX.Element }) {
	const tooltipContext = useContext(TooltipContext);

	if (!tooltipContext.enabled) return children;

	return (
		<Tooltip title={title}>
			{children}
		</Tooltip>
	);
}
