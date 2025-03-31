
export const getBaseUrlClientSide = () => {
        // Client-side: use window.location to get protocol and host
        const protocol = window.location.protocol;
        const host = window.location.host;
        return `${protocol}//${host}/api/`;
}