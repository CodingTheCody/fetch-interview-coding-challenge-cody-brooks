import {createContext} from 'react';

export const DogMatchContext = createContext<{dogIds: Set<string>, addDogId: (dogId: string) => void}>({dogIds: new Set<string>(), addDogId: () => {}});
