export type * from './auth';
export type * from './navigation';
export type * from './ui';


export type Venue = {
    id: number;
    name: string;
    category: 'Function Hall' | 'Conference' | 'Whole Venue';
    description: string;
    capacity_pax: number;
    capacity_label?: string;
    rate: string;
    rate_duration: string;
    inclusions: string[];
    note?: string;
    image?: string;
    available: boolean;
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
