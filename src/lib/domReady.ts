export function domReady() {
    return new Promise<void>((resolve, _) => {
        if (document.readyState !== 'loading') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', () => resolve());
        }
    });
}
