export type * from './auth';
export type * from './navigation';
export type * from './ui';


export type Venue = {
    id: number;
    name: string;
    category: 'Function Hall' | 'Conference' | 'Whole Venue';
    description: string;
    capacity: string;
    duration: string;
    amenities: string[];
    inclusions: string[];
    corkageFee?: string;
    rate: string;
    available: boolean;
    image: string;
};



export type MenuItem = {
    id: number;
    name: string;
    category: 'Coffee' | 'Non-Coffee' | 'Snacks' | 'Meals' | 'Desserts';
    description: string;
    price: number;
    image: string;
    available?: boolean;
};
