import { headers } from 'next/headers';

export async function getBaseUrl() {
    const headerList = headers();
    const host = (await headerList).get('host');

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    return `${protocol}://${host}/api/`;
}
