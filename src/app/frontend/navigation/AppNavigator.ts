export type AppRouteIntent = {
    PanelId: string;
    Payload?: unknown;
};

export class AppNavigator
{
    public Navigate(intent: AppRouteIntent): void
    {
        void intent;
    }
}
