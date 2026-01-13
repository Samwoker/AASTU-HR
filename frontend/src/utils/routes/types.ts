export interface IRoute {
  path: string;
  element: React.ReactNode;
  isAuthenticated?: boolean;
  allowedRoles?: number[];
  permissionGroups?: any[]; // Add permission groups if needed
}
