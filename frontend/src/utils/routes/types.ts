export interface IRoute {
  path: string;
  element: React.ReactNode;
  isAuthenticated?: boolean;
  permissionGroups?: any[]; // Add permission groups if needed
}
