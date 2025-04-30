// settings.tsx
import ReactDOM from 'react-dom/client';
import {RowProvider} from "../context.tsx";
import SettingsPage from "../components/settingsPage/settingsPage.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RowProvider>
            <SettingsPage />
    </RowProvider>
);
