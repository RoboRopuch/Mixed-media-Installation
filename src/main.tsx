// main.tsx
import ReactDOM from 'react-dom/client';
import {RowProvider} from "./context.tsx";
import AppV2 from "./AppV2.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RowProvider>
            <AppV2 />
    </RowProvider>
);
