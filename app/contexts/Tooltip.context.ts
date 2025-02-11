import {createContext} from 'react';

export type TooltipContextType = {
	enabled: boolean,
};

export const TooltipContext = createContext<TooltipContextType>({ enabled: true});
