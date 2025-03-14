import { headers } from 'next/headers';

export const getBaseUrlServerSide = async () => {
    const headerList = headers();
    const host = (await headerList).get('host');

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    return `${protocol}://${host}/api/`;
}
// export async function getBaseUrlServerSide() {
//     const headerList = headers();
//     const host = (await headerList).get('host');

//     const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

//     return `${protocol}://${host}/api/`;
// }