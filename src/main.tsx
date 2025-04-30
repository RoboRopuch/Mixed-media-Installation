// main.tsx
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {RowProvider} from "./context.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RowProvider>
            <App />
    </RowProvider>
);
