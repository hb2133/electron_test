import { BrowserWindow } from 'electron';

export type CreateMainWindowOptions = {
    MainWindowEntry: string;
    PreloadEntry: string;
};

export function CreateMainWindow(options: CreateMainWindowOptions): BrowserWindow
{
    const MainWindow = new BrowserWindow({
        width: 320,
        height: 240,
        useContentSize: true,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        autoHideMenuBar: true,
        title: 'MediaPipe Tracker[GPU]',
        backgroundColor: '#000000',
        show: false,
        webPreferences: {
            preload: options.PreloadEntry,
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    MainWindow.loadURL(options.MainWindowEntry);
    MainWindow.webContents.session.setPermissionRequestHandler((WebContents, Permission, Callback) =>
    {
        Callback(WebContents.id === MainWindow.webContents.id && Permission === 'media');
    });
    MainWindow.setMenu(null);
    MainWindow.once('ready-to-show', () =>
    {
        MainWindow.show();
    });

    return MainWindow;
}
