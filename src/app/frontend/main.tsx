import { createRoot } from 'react-dom/client';
import { App } from './App';

const RootContainer = document.getElementById('root');

if (RootContainer == null)
{
    throw new Error('Missing #root container for the Electron frontend.');
}

const Root = createRoot(RootContainer);

Root.render(
    <App />,
);
