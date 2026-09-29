// Typer
export type Car = {
    id: string;
    title: string;
    year: number;
    transmission: 'Automatic' | 'Manual';
    pricePerDay: number;
    /*imageUrl?: string; */  
};

type Props = {
    onOpenCar?: (car: Car) => void;
    onOpenFilter?: () => void;
    onOpenSort?: () => void;
    onPickDate?: (which: 'start' | 'end') => void;
};

