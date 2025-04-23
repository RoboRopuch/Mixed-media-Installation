// settings.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {RangeProvider} from "../context.tsx";
import SettingsPage from "../components/settingsPage/settingsPage.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RangeProvider>
            <SettingsPage />
    </RangeProvider>
);
