export type * from './auth';
export type * from './navigation';
export type * from './ui';


export type Venue = {
    id: number;
    name: string;
    category: 'Function Hall' | 'Conference' | 'Whole Venue';
    description: string;
    minimum_capacity_pax: number;
    maximum_capacity_pax: number;
    rate: string | number;
    minimum_booking_hours: number;
    extension_rate_per_hour: string | number;
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
