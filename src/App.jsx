import { useEffect } from 'react';

function App() {
    useEffect(() => {
        window.location.replace('/src/landing/landing.html');
    }, []);

    return null;
}

export default App;
