// src/utils/fakeApi.ts

type FakeTenant = {
    id: number;
    name: string;
    subdomain: string;
  };
  
  const fakeTenants: FakeTenant[] = [
    { id: 1, name: "AKM Industries", subdomain: "akm" },
    { id: 2, name: "DXT Solutions", subdomain: "dxt" },
    { id: 3, name: "Pioneer Maintenance", subdomain: "pioneer" },
    { id: 3, name: "TNDC", subdomain: "tndc" },
    { id: 3, name: "JimDent", subdomain: "jimdent" },
  ];
  
  export const fetchTenantBySubdomain = (subdomain: string): Promise<FakeTenant | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tenant = fakeTenants.find(t => t.subdomain === subdomain);
        resolve(tenant || null);
      }, 300); // Simulate 300ms network delay
    });
  };
  