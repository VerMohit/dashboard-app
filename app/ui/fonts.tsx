// This file will keep the fonts that will be used throughout the applications

import {Inter} from 'next/font/google';
import {Lusitana} from 'next/font/google';
import { Roboto } from 'next/font/google';

export const inter = Inter( { subsets: ['latin'] } );

export const lusitana = Lusitana({
    weight:["400", "700"],
    subsets: ['latin']
});

export const roboto = Roboto({
    weight:["400", "500", "700", "900"], 
    subsets: ['latin']
});